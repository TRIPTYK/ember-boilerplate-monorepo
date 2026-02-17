import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import { verifyAccessToken } from "#src/utils/jwt.utils.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeJsonApiError } from "@libs/backend-shared";

export function createJwtAuthMiddleware(
  em: EntityManager,
  jwtSecret: string,
  userRepository: EntityRepository<any>,
) {
  return async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send(
        makeJsonApiError(401, "Unauthorized", {
          code: "UNAUTHORIZED",
          detail: "Missing or invalid authorization header",
        }),
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token, jwtSecret);

    if (!payload) {
      return reply.code(401).send(
        makeJsonApiError(401, "Unauthorized", {
          code: "UNAUTHORIZED",
          detail: "Invalid or expired token",
        }),
      );
    }

    const user = await userRepository.findOne({ id: payload.userId });

    if (!user) {
      return reply.code(401).send(
        makeJsonApiError(401, "Unauthorized", {
          code: "UNAUTHORIZED",
          detail: "User not found",
        }),
      );
    }

    request.user = user;
  };
}
