# API Mocking in Tests

There is no HTTP interception layer. API calls are mocked at one of two levels,
depending on what the test is about.

## Rendering / integration tests — mock the service

The component under test talks to a service, so replace the service:

```typescript
vi.mock('#src/services/{entity}.ts', async (importActual) => {
  const actual = await importActual<typeof import('#src/services/{entity}.ts')>();
  return {
    ...actual,
    default: class Mock{Entity}Service extends actual.default {
      save = vi.fn();
    },
  };
});
```

## Unit tests on a service — mock the request layer

The service under test is the thing being exercised, so the store's request
chain is what gets stubbed. `mockApi` (in `tests/mock-api.ts`) returns a
WarpDrive handler that answers matching requests and lets everything else fall
through:

```typescript
import { mockApi } from '../mock-api.ts';

const {entities}Api = mockApi({
  'POST /{entities}': () => ({
    data: { type: '{entities}', id: 'new-{entity}-id', attributes: {} },
  }),
  'PATCH /{entities}/:id': ({ params }) => ({
    data: { type: '{entities}', id: params['id'], attributes: {} },
  }),
});

test('creates the entity', async ({ context }) => {
  await initializeTestApp(context.owner, 'en-us', [{entities}Api]);
  // ...
});
```

Handlers passed to `initializeTestApp` are inserted into the store's request
chain just before `Fetch`.

## Scoping mocks

Nothing is global: the store is rebuilt by every `initializeTestApp` call, so
mocks never leak between tests or files, and there is no teardown to write.

**Per file (default).** Declare the handler once at the top of the test file and
pass it in each test — this is the common case.

**Shared across files.** A handler is just a value, so it can live in its own
module and be imported by several test files:

```typescript
// tests/mocks/{entities}.ts
import { mockApi } from '../mock-api.ts';

export const {entities}Api = mockApi({
  'GET /{entities}': () => ({ data: [...], meta: { total: 3 } }),
  'POST /{entities}': ({ body }) => ({
    data: { type: '{entities}', id: 'new-{entity}-id', attributes: body.data.attributes },
  }),
});
```

These live in `tests/`, so they are not part of the lib's published API. Mocks
that another package needs to consume belong in `src/` with a matching
`package.json#exports` entry.

**Per test override.** The array is a chain: order is chain order, the first
handler that matches answers, and anything unmatched falls through to the next
one. So an override only has to declare the route it changes:

```typescript
const notFoundApi = mockApi({
  'GET /{entities}/:id': () => {
    throw new Error('Not Found');
  },
});

// notFoundApi answers that one route, {entities}Api still serves everything else
await initializeTestApp(context.owner, 'en-us', [notFoundApi, {entities}Api]);
```

Responders are closures, so per-file mutable fixtures (a list that grows with
each POST) work and reset naturally when the module is loaded.

## Key rules

- Routes are keyed `'<METHOD> /path/:param'`; the responder receives
  `{ params, body }` and returns the JSON:API payload (the `content` of the
  response, no envelope).
- Responses use JSON:API format: `{ data: { id, type, attributes } }`.
- An unmatched request falls through to the real network and will fail the
  test — that is intentional, it surfaces unmocked calls.
- Mock the service for component tests, the request chain for service tests.
  Never both in the same test.
- Put the override first when stacking handlers — first match wins.
- A responder that throws rejects the request: that is how failure paths
  (404, server error) are exercised.

**Why:** mocking inside the request chain keeps tests synchronous and dependency
free — no service worker to boot, no `beforeAll` lifecycle, and the real service
+ store code is still exercised end to end.
