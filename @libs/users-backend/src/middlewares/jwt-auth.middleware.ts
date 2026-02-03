import type { EntityManager } from "@mikro-orm/core";
import { verifyAccessToken } from "@lib/utils/jwt.utils.js";
import { UserEntity } from "@lib/entities/user.entity.js";
import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * JWT authentication middleware
 * Extracts Bearer token from Authorization header and verifies it
 * Loads the user from the database and attaches to request.user
 */
export function createJwtAuthMiddleware(em: EntityManager, jwtSecret: string) {
  return async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({
        message: "Missing or invalid authorization header",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyAccessToken(token, jwtSecret);

    if (!payload) {
      return reply.code(401).send({
        message: "Invalid or expired token",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    // Load user from database
    const userRepository = em.getRepository(UserEntity);
    const user = await userRepository.findOne({ id: payload.userId });

    if (!user) {
      return reply.code(401).send({
        message: "User not found",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    // Attach user to request
    request.user = user as any;
  };
}
