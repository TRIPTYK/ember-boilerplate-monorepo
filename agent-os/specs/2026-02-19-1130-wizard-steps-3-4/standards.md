# Standards for Wizard Steps 3 & 4

The following standards apply to this work.

---

## frontend/form-pattern

Forms use Zod validation + ImmerChangeset + TpkForm + HandleSaveService + entity service.

Per-step schemas are factory functions: `(intl: IntlService) => object({...})`.

Changeset mutations use `changeset.set('fieldPath', value)`.

---

## frontend/file-extensions

- `.gts` for Glimmer components with templates
- `.ts` for logic-only files (services, utilities, schemas)

---

## frontend/translations

All user-visible strings go through `ember-intl`. Use the `{{t "key"}}` helper in templates and `this.intl.t('key')` in TypeScript.

Keys follow the pattern: `{entity}.{section}.{subsection}.{key}` — e.g., `treatments.wizard.step3.labels.searchPlaceholder`.

Translation files: `@apps/front/translations/treatments/en-us.yaml` and `fr-fr.yaml`.

---

## frontend/schema-changeset

WarpDrive schema uses `withDefaults` from `@warp-drive/core`. The treatment `data` field is a JSON blob containing all treatment fields.

`ImmerChangeset` from `ember-immer-changeset` handles nested mutations immutably.

---

## global/import-alias

Use `#src/` instead of relative paths:
```typescript
import type { treatmentChangeset } from '#src/changesets/treatment.ts';
```

---

## global/post-implementation-checks

After implementation:
1. Run `pnpm lint` at repo root
2. Run `pnpm test` in `@libs/treatment-front`
