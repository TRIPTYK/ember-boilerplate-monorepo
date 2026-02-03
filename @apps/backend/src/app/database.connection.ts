import { defineConfig, MikroORM } from "@mikro-orm/sqlite";
import type { AppConfiguration } from "../configuration.js";
import { UserEntity } from "@libs/users-backend";

export function databaseConfig(config: Pick<AppConfiguration, "DATABASE_URI" | "SEED_CLASS">) {
  return defineConfig({
    seeder: {
      pathTs: "./src/seeders",
      defaultSeeder: config.SEED_CLASS,
    },
    clientUrl: config.DATABASE_URI,
    entities: [UserEntity],
  });
}

export async function createDatabaseConnection(
  config: Pick<AppConfiguration, "DATABASE_URI" | "SEED_CLASS">,
) {
  const orm = await MikroORM.init(databaseConfig(config));
  return orm;
}
