import type { EntityManager } from "@mikro-orm/core";

export interface LibraryContext {
  em: EntityManager;
  configuration: {
    jwtRefreshSecret: string;
    jwtSecret: string;
  };
}
