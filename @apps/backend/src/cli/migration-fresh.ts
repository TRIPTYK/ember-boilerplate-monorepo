import mikroOrmConfig from "#src/mikro-orm.config.ts";
import { DatabaseSeeder } from "#src/seeders/development.seeder.ts";
import { MikroORM } from "@mikro-orm/postgresql";

const orm = await MikroORM.init({ ...mikroOrmConfig, debug: true });

await orm.schema.drop();
await orm.migrator.up();
await orm.seeder.seed(DatabaseSeeder);

await orm.close(true);
