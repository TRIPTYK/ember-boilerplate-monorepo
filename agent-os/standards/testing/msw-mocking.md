# MSW API Mocking

Use openapi-msw for type-safe API mocking.

**Shared mocks (http-mocks/ folder):**
```typescript
import { createOpenApiHttp } from 'openapi-msw';
import type { paths } from 'backend-app';

const http = createOpenApiHttp<paths>();

export default [
  http.untyped.get('/api/v1/users/:id', (req) => {
    return HttpResponse.json({ data: mockUser });
  }),
];
```

**Inline mocks (unit/integration tests):**
```typescript
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('/users', () => HttpResponse.json({ data: { id: '123' } })),
];

beforeAll(async () => {
  const worker = setupWorker(...handlers);
  await worker.start();
  return () => worker.stop();
});
```

**Rules:**
- Use createOpenApiHttp when backend types available
- Use http.untyped for flexibility
- Shared mocks in http-mocks/ for acceptance/development
- Inline mocks for unit/integration tests

**Why:** Type-safe mocks catch API contract changes. Shared mocks enable development mode without backend.
