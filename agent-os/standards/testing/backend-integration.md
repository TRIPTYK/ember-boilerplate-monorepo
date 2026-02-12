# Backend Integration Testing

Integration tests use a real PostgreSQL database via Testcontainers, with transaction rollback for isolation.

## Vitest config

Two test projects per library:

```ts
// vitest.config.mts
test: {
  projects: [
    { test: { name: "Unit Tests", include: ["tests/unit/*.test.ts"], pool: "threads" } },
    { test: { name: "Integration Tests", globalSetup: "./tests/global-setup.ts", include: ["tests/**/*.test.ts"], pool: "forks" } },
  ],
}
```

## Global setup (`tests/global-setup.ts`)

Starts a PostgreSQL container, creates schema, seeds a test user:

```ts
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export async function setup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  const orm = await MikroORM.init({
    entities: [...todoEntities, ...userEntities],
    clientUrl: process.env.TEST_DATABASE_URL,
  });
  await orm.schema.refreshDatabase();
  // Seed test user for auth
  await orm.close();
}

export async function teardown() {
  await container?.stop();
}
```

## TestModule (`tests/utils/setup-module.ts`)

Class that wires up Fastify + Module + DB for testing:

```ts
export class TestModule {
  public static JWT_SECRET = "testSecret";
  public static TEST_USER_ID = "test-user-id";

  public static async init() {
    const orm = await MikroORM.init({ clientUrl: process.env.TEST_DATABASE_URL, ... });
    const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
    // set compilers, init module, setupRoutes
    return new TestModule(module, orm);
  }

  generateBearerToken(userId: string) { ... }
  async createTodo(data) { ... } // helper to insert test data
  async close() { ... }
}
```

## Test structure

```ts
let module: TestModule;

beforeAll(async () => { module = await TestModule.init(); });
afterAll(async () => { await module.close(); });

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("creates a todo", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
    payload: { data: { type: "todos", attributes: { title: "Test" } } },
  });
  expect(response.statusCode).toBe(200);
});
```

## Rules

- Use `aroundEach` with `em.begin()` / `em.rollback()` for test isolation (default strategy)
- One test file per route: `tests/integration/{action}.route.test.ts`
- Use `fastify.inject()` for HTTP testing — no real server needed
- Test success cases, validation errors, 404s, and auth failures
- Seed a test user in `global-setup.ts` for authenticated routes
- `TestModule` provides helpers: `generateBearerToken()`, entity creation helpers, `close()`
