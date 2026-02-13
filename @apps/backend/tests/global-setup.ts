import { entities as todoEntities } from "@libs/todos-backend";
import { entities as usersEntities } from "@libs/users-backend";
import { MikroORM } from "@mikro-orm/postgresql";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";

let container: StartedPostgreSqlContainer;

export async function setup() {
  container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("test_db")
    .withUsername("test_user")
    .withPassword("test_password")
    .start();

  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  const orm = await MikroORM.init({
    entities: [...usersEntities, ...todoEntities],
    clientUrl: process.env.TEST_DATABASE_URL,
    driver: await import("@mikro-orm/postgresql").then((m) => m.PostgreSqlDriver),
  });

  await orm.schema.refreshDatabase();

  await orm.close();
}

export async function teardown() {
  await container?.stop();
}
