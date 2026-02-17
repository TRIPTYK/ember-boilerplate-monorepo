import type { FastifyInstance } from "fastify";

export interface Route<T extends FastifyInstance = FastifyInstance> {
  routeDefinition(f: T): void;
}

export interface ModuleInterface<T extends FastifyInstance = FastifyInstance> {
  setupRoutes(fastify: T): Promise<void>;
}
