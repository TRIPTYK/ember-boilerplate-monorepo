import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { Route } from "@libs/backend-shared";
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
            401: object({
              message: string(),
              code: string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { refreshToken, allDevices } = request.body;

        // Verify JWT signature
        const payload = verifyRefreshToken(refreshToken, this.jwtRefreshSecret);

        if (!payload) {
          return reply.code(401).send({
            message: "Invalid or expired refresh token",
            code: "INVALID_TOKEN",
          });
        }

        const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);

        if (allDevices) {
          // Revoke all tokens for user
          await refreshTokenRepo.nativeUpdate(
            { userId: payload.userId, revokedAt: null },
            { revokedAt: new Date().toISOString() },
          );

          return reply.send({
            data: {
              success: true,
              message: "Logged out from all devices",
            },
          });
        }

        // Revoke only the provided token
        const tokenHash = hashToken(refreshToken);
        const storedToken = await refreshTokenRepo.findOne({ tokenHash });

        if (!storedToken) {
          return reply.code(401).send({
            message: "Refresh token not found",
            code: "TOKEN_NOT_FOUND",
          });
        }

        storedToken.revokedAt = new Date().toISOString();
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
