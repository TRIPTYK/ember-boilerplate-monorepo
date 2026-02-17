import type { EntityManager, EntityRepository } from "@mikro-orm/core";

export interface LibraryContext {
  em: EntityManager;
  userRepository: EntityRepository<any>;
  configuration: {
    jwtSecret: string;
  };
}
