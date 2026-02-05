import { defineConfig } from "@mikro-orm/postgresql";
import { loadConfiguration } from "./configuration.ts";
import { databaseConfig } from "./app/database.connection.ts";
import { seed } from "@ngneat/falso";

const config = loadConfiguration();

/**
 * Important for test reproduction
 */
seed(config.SEED);

export default defineConfig(databaseConfig(config));
