import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import { verifyPassword } from "#src/utils/auth.utils.js";
import { generateTokens } from "#src/utils/jwt.utils.js";
import { hashToken, generateFamilyId } from "#src/utils/token.utils.js";
import { email, object, string } from "zod";
import type { UserEntityType } from "#src/entities/user.entity.js";
import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";
import { randomUUID } from "crypto";

export class LoginRoute implements Route {
  public constructor(
    private userRepository: EntityRepository<UserEntityType>,
    private em: EntityManager,
    private jwtSecret: string,
    private jwtRefreshSecret: string,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/login",
      {
        schema: {
          body: object({
            email: email(),
            password: string().min(8),
            deviceInfo: string().optional(),
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
        const { email, password, deviceInfo } = request.body;

        // Find user by email
        const user = await this.userRepository.findOne({ email });

        if (!user) {
          return reply.code(401).send(
            makeJsonApiError(401, "Invalid Credentials", {
              code: "INVALID_CREDENTIALS",
              detail: "Invalid email or password",
            }),
          );
        }

        // Verify password
        const isValidPassword = await verifyPassword(user.password, password);

        if (!isValidPassword) {
          return reply.code(401).send(
            makeJsonApiError(401, "Invalid Credentials", {
              code: "INVALID_CREDENTIALS",
              detail: "Invalid email or password",
            }),
          );
        }

        // Generate tokens
        const tokens = generateTokens(
          { userId: user.id, email: user.email },
          this.jwtSecret,
          this.jwtRefreshSecret,
        );

        // Store refresh token hash in database
        const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);
        const tokenHash = hashToken(tokens.refreshToken);

        refreshTokenRepo.create({
          id: randomUUID(),
          tokenHash,
          userId: user.id,
          deviceInfo: deviceInfo ?? null,
          ipAddress: request.ip,
          userAgent: request.headers["user-agent"] ?? null,
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          revokedAt: null,
          familyId: generateFamilyId(),
        });

        await this.em.flush();

        return reply.send({
          data: tokens,
        });
      },
    );
  }
}
