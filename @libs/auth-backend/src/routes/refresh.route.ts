import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import { verifyRefreshToken, generateTokens } from "#src/utils/jwt.utils.js";
import { hashToken } from "#src/utils/token.utils.js";
import { object, string } from "zod";
import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";
import { randomUUID } from "crypto";

export class RefreshRoute implements Route {
  public constructor(
    private em: EntityManager,
    private userRepository: EntityRepository<any>,
    private jwtSecret: string,
    private jwtRefreshSecret: string,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/refresh",
      {
        schema: {
          body: object({
            refreshToken: string(),
          }),
          response: {
            200: object({
              data: object({
                accessToken: string(),
                refreshToken: string(),
              }),
            }),
            401: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { refreshToken } = request.body;

        const payload = verifyRefreshToken(refreshToken, this.jwtRefreshSecret);

        if (!payload) {
          return reply.code(401).send(
            makeJsonApiError(401, "Invalid Token", {
              code: "INVALID_TOKEN",
              detail: "Invalid or expired refresh token",
            }),
          );
        }

        const tokenHash = hashToken(refreshToken);
        const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);
        const storedToken = await refreshTokenRepo.findOne({ tokenHash });

        if (!storedToken) {
          return reply.code(401).send(
            makeJsonApiError(401, "Token Not Found", {
              code: "TOKEN_NOT_FOUND",
              detail: "Refresh token not found",
            }),
          );
        }

        if (storedToken.revokedAt !== null) {
          await refreshTokenRepo.nativeUpdate(
            { familyId: storedToken.familyId },
            { revokedAt: new Date() },
          );

          return reply.code(401).send(
            makeJsonApiError(401, "Token Revoked", {
              code: "TOKEN_REVOKED",
              detail: "Token has been revoked",
            }),
          );
        }

        if (new Date(storedToken.expiresAt) < new Date()) {
          return reply.code(401).send(
            makeJsonApiError(401, "Token Expired", {
              code: "TOKEN_EXPIRED",
              detail: "Refresh token has expired",
            }),
          );
        }

        const user = await this.userRepository.findOne({ id: payload.userId });

        if (!user) {
          return reply.code(401).send(
            makeJsonApiError(401, "User Not Found", {
              code: "USER_NOT_FOUND",
              detail: "User not found",
            }),
          );
        }

        storedToken.revokedAt = new Date();

        const tokens = generateTokens(
          { userId: user.id, email: user.email },
          this.jwtSecret,
          this.jwtRefreshSecret,
        );

        const newTokenHash = hashToken(tokens.refreshToken);

        refreshTokenRepo.create({
          id: randomUUID(),
          tokenHash: newTokenHash,
          userId: user.id,
          deviceInfo: storedToken.deviceInfo,
          ipAddress: request.ip,
          userAgent: request.headers["user-agent"] ?? null,
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          revokedAt: null,
          familyId: storedToken.familyId,
        });

        await this.em.flush();

        return reply.send({
          data: tokens,
        });
      },
    );
  }
}
