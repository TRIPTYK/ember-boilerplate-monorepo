# References — Settings Service

## Similar Implementations

### Treatment Service

- **Location:** `@libs/treatment-front/src/services/treatment.ts`
- **Relevance:** Direct model for the settings service pattern — `@service store: Store`, `updateRecord`, `cacheKeyFor`, `peekRecord`, `assert`
- **Key patterns:** `Object.assign(existing, { ... })` before calling `updateRecord`; manual `request.body = JSON.stringify({ data: cache.peek(...) })`

### Treatment Schema

- **Location:** `@libs/treatment-front/src/schemas/treatments.ts`
- **Relevance:** Reference for WarpDrive schema shape — `withDefaults`, `WithLegacy`, `[Type]`, named type exports
- **Key patterns:** `type` plural matches API resource type; export both default schema and named types

### Treatment View Route (findRecord usage)

- **Location:** `@libs/treatment-front/src/routes/dashboard/treatments/view.gts`
- **Relevance:** Shows how to use `findRecord` from `@warp-drive/utilities/json-api` with `store.request()`
- **Key patterns:** `const response = await this.store.request(findRecord<T>('type', id, { include: [] }))` then `response.content.data`

### HTTP Mocks (treatments)

- **Location:** `@libs/treatment-front/src/http-mocks/treatments.ts`
- **Relevance:** MSW mock structure, JSON:API format, `http.untyped.*` usage
- **Key patterns:** Mock array with `{ id, type, attributes }` shape; `http.untyped.get/post/patch` for untyped endpoints; `all.ts` aggregator
