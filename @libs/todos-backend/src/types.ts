import type { UserEntityType } from "@libs/users-backend";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserEntityType;
  }
}
