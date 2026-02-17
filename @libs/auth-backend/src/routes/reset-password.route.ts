import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import { hashPassword } from "#src/utils/auth.utils.js";
import { hashToken } from "#src/utils/token.utils.js";
import { boolean, object, string } from "zod";
import { PasswordResetTokenEntity } from "#src/entities/password-reset-token.entity.js";
import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";

export class ResetPasswordRoute implements Route {
  public constructor(
    private userRepository: EntityRepository<any>,
    private em: EntityManager,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/reset-password",
      {
        schema: {
          body: object({
            token: string(),
            password: string().min(8),
          }),
          response: {
            200: object({
              data: object({
                success: boolean(),
              }),
            }),
            400: jsonApiErrorDocumentSchema,
            401: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { token, password } = request.body;

        const tokenHash = hashToken(token);
        const resetTokenRepo = this.em.getRepository(PasswordResetTokenEntity);
        const resetToken = await resetTokenRepo.findOne({ tokenHash });

        if (!resetToken) {
          return reply.code(401).send(
            makeJsonApiError(401, "Invalid Token", {
              code: "INVALID_TOKEN",
              detail: "Invalid or expired token",
            }),
          );
        }

        if (resetToken.usedAt !== null) {
          return reply.code(401).send(
            makeJsonApiError(401, "Token Already Used", {
              code: "TOKEN_ALREADY_USED",
              detail: "This reset token has already been used",
            }),
          );
        }

        if (new Date(resetToken.expiresAt) < new Date()) {
          return reply.code(401).send(
            makeJsonApiError(401, "Token Expired", {
              code: "TOKEN_EXPIRED",
              detail: "Reset token has expired",
            }),
          );
        }

        const user = await this.userRepository.findOne({ id: resetToken.userId });

        if (!user) {
          return reply.code(401).send(
            makeJsonApiError(401, "User Not Found", {
              code: "USER_NOT_FOUND",
              detail: "User not found",
            }),
          );
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;

        resetToken.usedAt = new Date();

        const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);
        await refreshTokenRepo.nativeUpdate(
          { userId: user.id, revokedAt: null },
          { revokedAt: new Date() },
        );

        await this.em.flush();

        return reply.send({
          data: { success: true },
        });
      },
    );
  }
}
