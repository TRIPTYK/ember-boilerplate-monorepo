import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";
import type { EntityManager } from "@mikro-orm/core";
import { verifyRefreshToken } from "#src/utils/jwt.utils.js";
import { hashToken } from "#src/utils/token.utils.js";
import { boolean, object, string } from "zod";
import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";

export class LogoutRoute implements Route {
  public constructor(
    private em: EntityManager,
    private jwtRefreshSecret: string,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/logout",
      {
        schema: {
          body: object({
            refreshToken: string(),
            allDevices: boolean().optional().default(false),
          }),
          response: {
            200: object({
              data: object({
                success: boolean(),
                message: string(),
              }),
            }),
            401: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { refreshToken, allDevices } = request.body;

        const payload = verifyRefreshToken(refreshToken, this.jwtRefreshSecret);

        if (!payload) {
          return reply.code(401).send(
            makeJsonApiError(401, "Invalid Token", {
              code: "INVALID_TOKEN",
              detail: "Invalid or expired refresh token",
            }),
          );
        }

        const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);

        if (allDevices) {
          await refreshTokenRepo.nativeUpdate(
            { userId: payload.userId, revokedAt: null },
            { revokedAt: new Date() },
          );

          return reply.send({
            data: {
              success: true,
              message: "Logged out from all devices",
            },
          });
        }

        const tokenHash = hashToken(refreshToken);
        const storedToken = await refreshTokenRepo.findOne({ tokenHash });

        if (!storedToken) {
          return reply.code(401).send(
            makeJsonApiError(401, "Token Not Found", {
              code: "TOKEN_NOT_FOUND",
              detail: "Refresh token not found",
            }),
          );
        }

        storedToken.revokedAt = new Date();
        await this.em.flush();

        return reply.send({
          data: {
            success: true,
            message: "Logged out successfully",
          },
        });
      },
    );
  }
}
