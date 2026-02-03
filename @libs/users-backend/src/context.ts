import type { EntityManager } from "@mikro-orm/core";
import type { FastifyInstanceTypeForModule } from "./init.js";

export interface LibraryContext {
  fastifyInstance: FastifyInstanceTypeForModule;
  em: EntityManager;
  configuration: {
    jwtRefreshSecret: string;
    jwtSecret: string;
  };
}
