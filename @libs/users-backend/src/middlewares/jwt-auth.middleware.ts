import type { EntityManager } from "@mikro-orm/core";
import { verifyAccessToken } from "#src/utils/jwt.utils.js";
import { UserEntity } from "#src/entities/user.entity.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeJsonApiError } from "@libs/backend-shared";

/**
 * JWT authentication middleware
 * Extracts Bearer token from Authorization header and verifies it
 * Loads the user from the database and attaches to request.user
 */
export function createJwtAuthMiddleware(em: EntityManager, jwtSecret: string) {
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

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyAccessToken(token, jwtSecret);

    if (!payload) {
      return reply.code(401).send(
        makeJsonApiError(401, "Unauthorized", {
          code: "UNAUTHORIZED",
          detail: "Invalid or expired token",
        }),
      );
    }

    // Load user from database
    const userRepository = em.getRepository(UserEntity);
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
