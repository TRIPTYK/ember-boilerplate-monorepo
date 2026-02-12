# HTTP Mocks Pattern

Each lib provides MSW mock handlers in `src/http-mocks/`.

## File structure

```
src/http-mocks/
├── {entities}.ts    # CRUD mock handlers for entity
└── all.ts           # Aggregates all handlers
```

## Handler file

Use `openapi-msw` with typed handlers when the backend types are available:

```typescript
import { HttpResponse } from 'msw';
import type { paths } from '@apps/backend';
import { createOpenApiHttp } from 'openapi-msw';

const mockData = [
  { id: '1', type: '{entities}' as const, attributes: { title: '...', description: '...' } },
];

const http = createOpenApiHttp<paths>();

export default [
  http.get('/api/v1/{entities}/{id}', (req) => {
    const { id } = req.params;
    const item = mockData.find((d) => d.id === id);
    return item
      ? HttpResponse.json({ data: item })
      : HttpResponse.json({ message: 'Not Found', code: '{ENTITY}_NOT_FOUND' }, { status: 404 });
  }),

  // Use http.untyped.* when typed handler doesn't match (e.g., list with filters)
  http.untyped.get('/api/v1/{entities}', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('filter[search]');
    const sort = url.searchParams.get('sort');
    // ... filter and sort logic
    return HttpResponse.json({ data: results, meta: { total: results.length } });
  }),

  http.post('/api/v1/{entities}/', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;
    return HttpResponse.json({
      data: { id: json.data.lid, type: '{entities}' as const, attributes: json.data.attributes },
    });
  }),

  http.patch('/api/v1/{entities}/{id}', async (req) => { /* same pattern */ }),
  http.delete('/api/v1/{entities}/{id}', (req) => { /* return success message */ }),
];
```

## Aggregator file

`all.ts` — combines all handler arrays:

```typescript
import {entities} from './{entities}.ts';
import login from './login.ts';

export default [...login, ...{entities}];
```

## Key rules

- Prefer typed `http.get/post/patch/delete` from `createOpenApiHttp<paths>()` when backend types exist
- Fall back to `http.untyped.*` when typed handlers don't match (e.g., list with query params)
- Mock data uses JSON:API format: `{ id, type, attributes }`
- Response envelope: `{ data }` for success, `{ message, code }` for errors
- Every lib must have an `all.ts` that exports all handlers
