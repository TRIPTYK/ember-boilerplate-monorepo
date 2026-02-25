# Plan — Settings Service (Frontend)

## Context

The treatment form wizard uses hardcoded option lists (security measures, categories, purposes, etc.). The settings system lets organizations persist custom additions to these lists across all treatments. This plan creates the WarpDrive schema, Ember service, and MSW mocks for settings — no integration into form steps or routes yet.

- Location: `@libs/treatment-front`
- Scope: frontend only (schema + service + mocks)
- API pattern: WarpDrive with `key` as the JSON:API `id`

## Files created/modified

| File | Action |
|------|--------|
| `@libs/treatment-front/src/schemas/settings.ts` | Created |
| `@libs/treatment-front/src/services/setting.ts` | Created |
| `@libs/treatment-front/src/http-mocks/settings.ts` | Created |
| `@libs/treatment-front/src/http-mocks/all.ts` | Updated |

## Not in scope (future integration)

- Register `settingSchema` in `src/index.ts` → `initialize()` via `SchemaService.defineSchema`
- Inject `SettingService` into form step components
- Pre-load settings at the `dashboard` route level
- Settings management UI page (`/dashboard/settings`)
- Backend module (`@libs/settings-backend`)
