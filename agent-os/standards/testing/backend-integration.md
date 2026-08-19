# Backend Integration Testing

Integration tests use a real PostgreSQL database via Testcontainers, with transaction rollback for
isolation. Because `EntityManager#getContext()` prefers the `TransactionContext` over the
`RequestContext`, the test transaction wins over the per-request fork and everything the routes do
is rolled back.

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
  await orm.schema.refresh();
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
    // set compilers
    registerRequestContext(fastifyInstance, orm.em); // same wiring as production
    // init module with `em: orm.em` (root EM, never a fork), setupRoutes
    return new TestModule(module, orm);
  }

  get em() { return this.orm.em; }

  public async isolate(runTest: () => Promise<void>) {
    class Rollback extends Error {}

    await this.orm.em
      .transactional(async () => {
        await runTest();
        throw new Rollback();
      })
      .catch((error: unknown) => {
        if (!(error instanceof Rollback)) throw error;
      });
  }

  generateBearerToken(userId: string) { ... }
  async createTodo(data) { ... } // helper to insert test data
  async close() { ... }
}
```

`TestModule` wires Fastify exactly like `App.init` does: the modules get the **root** `orm.em` and a
`RequestContext` is opened per request. `isolate()` is duplicated in each library's
`setup-module.ts` — there is no shared test package to hold it, and 8 lines do not justify creating
one.

## Test structure

```ts
let module: TestModule;

beforeAll(async () => { module = await TestModule.init(); });
afterAll(async () => { await module.close(); });

aroundEach((runTest) => module.isolate(runTest));

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

## Seed helpers use `insert()`

Seed helpers (`createUser`, `createTodo`, `storeRefreshToken`, …) use `repo.insert()`, never
`repo.create()` + `em.flush()`.

`create` / `find` / `persist` / `flush` go through `getContext()` **with validation**, so they throw
`ValidationError.cannotUseGlobalContext()` when called on the root EM outside a request and outside
a transaction — which is exactly what a `beforeAll` seed does. `insert()` goes through
`getContext(false)`: no validation, and it still resolves the `TransactionContext`, so a seed called
from inside `isolate()` joins the test transaction and is rolled back with it.

Never set `allowGlobalContext: true` to work around this. With `true`, a route accidentally using
the global EM would pass the tests silently — the very regression this setup is meant to catch.

## Rules

- Use `aroundEach((runTest) => module.isolate(runTest))` for test isolation (default strategy)
- Seed helpers use `repo.insert()`, never `create()` + `flush()`
- Never enable `allowGlobalContext` in tests
- One test file per route: `tests/integration/{action}.route.test.ts`
- Use `fastify.inject()` for HTTP testing — no real server needed
- Test success cases, validation errors, 404s, and auth failures
- Seed a test user in `global-setup.ts` for authenticated routes
- `TestModule` provides helpers: `generateBearerToken()`, entity creation helpers, `close()`
