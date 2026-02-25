# Standards — Settings Service

The following standards apply to this work.

---

## frontend/service-crud

Each entity gets a service in `@libs/{entities}-front/src/services/{entity}.ts`.
`save()` receives raw validated data (not a changeset).
Use `peekRecord` for update/delete (record must already be in store).
Always `assert` that records exist before update/delete.
`request.body` manual assignment is a WarpDrive workaround.

---

## frontend/schema-changeset

Schema `type` matches the API resource type (plural).
Export both the schema (default) and the type (named).
Uses `@warp-drive/legacy` API intentionally.

For settings, there is no changeset (settings are updated directly via the service).

---

## frontend/http-mocks

Prefer typed `http.get/post/patch/delete` from `createOpenApiHttp<paths>()` when backend types exist.
Fall back to `http.untyped.*` when typed handlers don't match.
Mock data uses JSON:API format: `{ id, type, attributes }`.
Response envelope: `{ data }` for success, `{ message, code }` for errors.
Every lib must have an `all.ts` that exports all handlers.
