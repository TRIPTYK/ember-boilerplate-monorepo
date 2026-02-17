import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { jsonApiErrorDocumentSchema, type Route } from "@libs/backend-shared";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import { hashToken } from "#src/utils/token.utils.js";
import { boolean, email, object } from "zod";
import { PasswordResetTokenEntity } from "#src/entities/password-reset-token.entity.js";
import { EmailService } from "@libs/backend-shared";
import { randomBytes } from "crypto";
import { randomUUID } from "crypto";

export class ForgotPasswordRoute implements Route {
  public constructor(
    private userRepository: EntityRepository<any>,
    private em: EntityManager,
    private emailService: EmailService,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/forgot-password",
      {
        schema: {
          body: object({
            email: email(),
          }),
          response: {
            200: object({
              data: object({
                success: boolean(),
              }),
            }),
            400: jsonApiErrorDocumentSchema,
            500: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        try {
          const { email } = request.body;

          const user = await this.userRepository.findOne({ email });

          if (user) {
            const resetTokenRepo = this.em.getRepository(PasswordResetTokenEntity);

            await resetTokenRepo.nativeDelete({
              userId: user.id,
              usedAt: null,
            });

            const token = randomBytes(32).toString("hex");
            const tokenHash = hashToken(token);
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

            resetTokenRepo.create({
              id: randomUUID(),
              tokenHash,
              userId: user.id,
              email: user.email,
              expiresAt,
              usedAt: null,
              createdAt: new Date().toISOString(),
            });

            await this.em.flush();

            try {
              await this.emailService.sendPasswordResetEmail(user.email, token, user.firstName);
            } catch {
              return reply.code(500).send({
                errors: [
                  {
                    status: "500",
                    title: "Email Service Error",
                    detail: "Failed to send password reset email. Please try again later.",
                    code: "EMAIL_SEND_FAILED",
                  },
                ],
              });
            }
          }

          return reply.send({
            data: { success: true },
          });
        } catch (error) {
          return reply.code(500).send({
            errors: [
              {
                status: "500",
                title: "Internal Server Error",
                detail: error instanceof Error ? error.message : "An unexpected error occurred",
                code: "INTERNAL_ERROR",
              },
            ],
          });
        }
      },
    );
  }
}
