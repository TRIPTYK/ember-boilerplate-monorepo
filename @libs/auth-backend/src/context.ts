import type { EntityManager, EntityRepository } from "@mikro-orm/core";

import type { EmailMode } from "@libs/backend-shared";

export interface AuthLibraryContext {
  em: EntityManager;
  userRepository: EntityRepository<any>;
  configuration: {
    jwtRefreshSecret: string;
    jwtSecret: string;
    appUrl: string;
    appName: string;
    emailFromAddress: string;
    emailMode?: EmailMode;
    emailTestRecipient?: string;
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
}
