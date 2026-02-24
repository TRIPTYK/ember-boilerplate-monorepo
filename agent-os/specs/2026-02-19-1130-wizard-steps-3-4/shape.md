# Wizard Steps 3 & 4 — Shaping Notes

## Scope

Add Steps 3 (Finalités du traitement) and 4 (Catégories de personnes concernées) to the treatment creation wizard, based on `SPECIFICATIONS_ETAPES_3_4_FORMULAIRE.md`.

Both steps share the same interaction pattern: a searchable multi-select with chip display. Step 3 adds a sub-purposes modal; Step 4 adds a category precisions modal.

## Decisions

- **Custom values**: In-memory only for this release (no settings persistence). Adding to a settings entity is deferred.
- **Modals**: Use `TpkModal` from `@triptyk/ember-ui` (confirmed available in the package).
- **Step 3 validation**: No required fields — both steps are fully optional (user can skip).
- **`subjectCategoryPrecisions` field**: New field added to Zod schemas and changeset to store per-category precision texts (mirrors the `subReasons` pattern with `{name, additionalInformation}`).
- **Wizard extends from 2 → 4 steps**: Step 2 navigation changes from "Terminer" to "Suivant". Step 4 becomes the new terminal step.
- **`SearchableOptionsGroup`**: Extracted as a reusable component shared by both steps 3 and 4. Popular options (max 4) are picked randomly and fixed at component construction.

## Context

- **Visuals**: See `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/` for Step_3.jpeg, Step_3_2.jpeg, Step_4.jpeg, Step_4_2.jpeg
- **References**: Existing wizard steps 1 and 2, TreatmentsTable (TpkModal/TpkConfirmModal usage)
- **Product alignment**: This is part of the 8-step GDPR treatment wizard. Only steps 3 and 4 are in scope here.

## Standards Applied

- `frontend/form-pattern` — Zod + ImmerChangeset + TpkForm component pattern
- `frontend/file-extensions` — .gts for templates
- `frontend/translations` — i18n key conventions
- `frontend/schema-changeset` — WarpDrive schema and ImmerChangeset
- `global/import-alias` — Use #src/ import alias
- `global/post-implementation-checks` — Run lint and tests after implementation
