# Settings Service — Shaping Notes

## Scope

Create the WarpDrive schema, Ember service, and MSW mocks for the settings system.
No integration into form steps or routes yet — that is a separate task.

## Decisions

- **Location:** Inside `@libs/treatment-front` (not a new library), since settings are currently only used by treatment forms.
- **API pattern:** WarpDrive with `key` as the JSON:API `id` (e.g., `id: 'customMeasures', type: 'settings'`). Settings are treated as WarpDrive resources.
- **Scope:** Frontend only. Backend module will be created separately.
- **`loadAll` fallback:** If `op: 'query'` raw request does not work, `loadAll` can call `load()` for each key in parallel.
- **Future backend integration:** The real backend API returns `{ key, value }` (not JSON:API). When connecting to it, either update the backend to return JSON:API format, or write a WarpDrive request adapter to transform the response.

## Context

- **Visuals:** None
- **References:** `@libs/treatment-front/src/services/treatment.ts`, `src/routes/dashboard/treatments/view.gts`
- **Product alignment:** N/A (no agent-os/product/ folder)

## Standards Applied

- `frontend/service-crud` — WarpDrive service pattern with `updateRecord`, `peekRecord`, `cacheKeyFor`
- `frontend/schema-changeset` — WarpDrive schema with `withDefaults`, `WithLegacy`, `[Type]`
- `frontend/http-mocks` — MSW handlers with `openapi-msw`, JSON:API response format
