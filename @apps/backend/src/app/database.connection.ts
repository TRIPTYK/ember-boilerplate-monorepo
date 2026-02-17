import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import type { AppConfiguration } from "../configuration.js";
import { UserEntity } from "@libs/users-backend";
import { RefreshTokenEntity, PasswordResetTokenEntity } from "@libs/auth-backend";
import { TodoEntity } from "@libs/todos-backend";

export function databaseConfig(config: Pick<AppConfiguration, "DATABASE_URI">) {
  return defineConfig({
    seeder: {
      pathTs: "./src/seeders",
    },
    clientUrl: config.DATABASE_URI,
    entities: [UserEntity, RefreshTokenEntity, PasswordResetTokenEntity, TodoEntity],
  });
}

export async function createDatabaseConnection(config: Pick<AppConfiguration, "DATABASE_URI">) {
  const orm = await MikroORM.init(databaseConfig(config));
  return orm;
}
