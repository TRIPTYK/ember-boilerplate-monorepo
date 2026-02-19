# Standards for Advanced Treatments Table

The following standards apply to this implementation. Full content included for reference.

---

## frontend/lib-structure

New frontend libs live in `@libs/{name}-front/`.

### Required folder structure

```
@libs/{name}-front/
├── src/
│   ├── index.ts              # Entry point: initialize(), moduleRegistry(), forRouter()
│   ├── assets/icons/          # SVG icon components (.gts)
│   ├── changesets/            # ImmerChangeset type wrappers
│   ├── components/
│   │   └── forms/             # Form components + validation schemas
│   ├── http-mocks/            # MSW mock handlers + all.ts aggregator
│   ├── routes/dashboard/{entity}/  # Route handlers + templates
│   ├── schemas/               # WarpDrive schema definitions
│   ├── services/              # Ember services (CRUD, etc.)
│   └── styles/                # CSS styles
```

**Application to this project:**
- Add `src/components/table-cells/` for custom cell renderers
- Create icons in `src/assets/icons/`
- Extend service in `src/services/treatment.ts`
- Update schema in `src/schemas/treatments.ts`
- Add route in `src/routes/dashboard/treatments/view.gts`

---

## frontend/service-crud

Each entity gets a service for CRUD operations via WarpDrive.

### Pattern

```typescript
export default class {Entity}Service extends Service {
  @service declare store: Store;

  public async save(data: Validated{Entity} | Updated{Entity}) {
    if (data.id) {
      return this.update(data as Updated{Entity});
    } else {
      return this.create(data as Validated{Entity});
    }
  }

  public async update(data: Updated{Entity}) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be updated', existing);
    Object.assign(existing, { /* fields */ });
    const request = updateRecord(existing, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    await this.store.request(request);
  }
}
```

**Application to this project:**
- Add `archive(id: string)` method to TreatmentService
- Add `unarchive(id: string)` method to TreatmentService
- Add `updateType(id: string, treatmentType: string)` method to TreatmentService
- All methods use `peekRecord` + `Object.assign` + `updateRecord` pattern

---

## frontend/translations

Libs export translation keys. Apps provide the actual translations.

### Key naming convention

`{entities}.{context}.{subcontext}.{key}`

Examples:
```
treatments.table.advanced.headers.title
treatments.table.advanced.actions.archive
treatments.table.advanced.status.draft
treatments.table.advanced.messages.archiveSuccess
```

### File location

```
@apps/front/app/translations/
├── treatments/
│   ├── en-us.yaml
│   └── fr-fr.yaml
```

**Application to this project:**
- Add `table.advanced.*` keys to existing translation files
- Include headers, actions, filters, status labels, messages
- Ensure both EN and FR translations are complete

---

## frontend/http-mocks

Each lib provides MSW mock handlers.

### Pattern

```typescript
import { HttpResponse } from 'msw';
import { createOpenApiHttp } from 'openapi-msw';

const http = createOpenApiHttp<paths>();

export default [
  http.untyped.post('/api/v1/{entities}/:id/action', (req) => {
    const { id } = req.params;
    // Perform action on mock data
    return HttpResponse.json({ data: { id, /* updated fields */ } });
  }),
];
```

**Application to this project:**
- Add POST `/api/v1/treatments/:id/archive` handler
- Add POST `/api/v1/treatments/:id/unarchive` handler
- Add POST `/api/v1/treatments/update-order` handler (for future)
- Update GET `/api/v1/treatments` to support `includeArchived` query param
- Update mock data to include `status`, `order`, `isOverDueDate` fields
- Add `personalDataGroup` and `financialDataGroup` with `isSensitive` flags

---

## frontend/data-loading

Load data using `store.request()` with JSON:API request builders.

### Pattern

```typescript
import { query } from '@warp-drive/utilities/json-api';

const response = await this.store.request(
  query('treatments', {
    include: [],
    'page[size]': 100,
  }, { reload: true })
);

const treatments = response.content.data;
```

**Application to this project:**
- Use `query()` with `{ reload: true }` to always fetch fresh data
- Client-side filtering after load (filter by type, archived status)
- Invalidate cache after mutations to trigger reload

---

## frontend/route-template

Routes and templates are separate files.

### Pattern

```
src/routes/dashboard/{entities}/
├── view.gts              # Route handler
└── view-template.gts     # Template
```

**Application to this project:**
- Create `view.gts` route handler with model hook
- Create `view-template.gts` with read-only display
- Load treatment by ID in model hook
- Display all treatment data in organized sections

---

## global/import-alias

Use `#src/` import alias instead of relative paths.

### Pattern

```typescript
import type { Treatment } from '#src/schemas/treatments.ts';
import TreatmentService from '#src/services/treatment.ts';
```

**Application to this project:**
- All imports within @libs/treatment-front use `#src/` prefix
- Consistent across all new files

---

## global/post-implementation-checks

Run lint globally and tests on modified packages after implementation.

### Commands

```bash
pnpm run lint
pnpm run test --filter @libs/treatment-front
```

**Application to this project:**
- Run linter after all changes
- Run tests for treatment-front package
- Fix any linter errors
- Ensure all tests pass
