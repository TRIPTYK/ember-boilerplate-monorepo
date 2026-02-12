import type { EntityManager } from "@mikro-orm/core";

export interface LibraryContext {
  em: EntityManager;
  configuration: {
    jwtSecret: string;
  };
}
