import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import type { AppConfiguration } from "../configuration.js";
import { RefreshTokenEntity, UserEntity } from "@libs/users-backend";

export function databaseConfig(config: Pick<AppConfiguration, "DATABASE_URI">) {
  return defineConfig({
    seeder: {
      pathTs: "./src/seeders",
    },
    clientUrl: config.DATABASE_URI,
    entities: [UserEntity, RefreshTokenEntity],
  });
}

export async function createDatabaseConnection(config: Pick<AppConfiguration, "DATABASE_URI">) {
  const orm = await MikroORM.init(databaseConfig(config));
  return orm;
}
