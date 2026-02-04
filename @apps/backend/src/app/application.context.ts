import type { AppConfiguration } from "#src/configuration.js";
import type { Logger } from "pino";
import { logger } from "./logger.js";
import type { MikroORM } from "@mikro-orm/core";
import { createDatabaseConnection } from "./database.connection.js";

export interface ApplicationContext {
  configuration: AppConfiguration;
  logger: Logger;
  orm: MikroORM;
}

export async function createApplicationContext(configuration: AppConfiguration) {
  return {
    configuration,
    logger: logger({ PRODUCTION_ENV: configuration.PRODUCTION_ENV }),
    orm: await createDatabaseConnection(configuration),
  } satisfies ApplicationContext;
}
