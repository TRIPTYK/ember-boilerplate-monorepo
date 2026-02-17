import type { UserEntityType } from "./entities/user.entity.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserEntityType;
  }
}
