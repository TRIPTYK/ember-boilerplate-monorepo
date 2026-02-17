import type { EntityManager } from "@mikro-orm/core";

export interface UserLibraryContext {
  em: EntityManager;
  configuration: {
    jwtSecret: string;
  };
}
