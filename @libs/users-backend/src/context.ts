import type { EntityManager } from "@mikro-orm/core";

export interface UserLibraryContext {
  em: EntityManager;
  configuration: {
    jwtSecret: string;
  };
}

export interface AuthLibraryContext {
  em: EntityManager;
  configuration: {
    jwtRefreshSecret: string;
    jwtSecret: string;
  };
}
