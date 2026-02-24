# References for Wizard Steps 3 & 4

## Similar Implementations

### Wizard Steps 1 & 2

- **Location**: `@libs/treatment-front/src/components/wizard/`
- **Relevance**: Direct predecessors — same wizard container, same changeset/validation pattern, same navigation structure.
- **Key patterns**: Step components receive `@changeset` and optionally `@form` (TpkForm context). The wizard manages step state, progress indicator, and navigation buttons.

### TpkModal Usage (TreatmentsTable)

- **Location**: `@libs/treatment-front/src/components/treatments-table.gts`
- **Relevance**: Shows how `TpkConfirmModalPrefab` is used with `@isOpen` / `@onClose` pattern. The custom modals in steps 3 & 4 use `TpkModal` directly with the same open/close state pattern.
- **Key patterns**: `@tracked isModalOpen`, `@action openModal()`, `@action closeModal()`

### Zod Schema Pattern (treatment-validation.ts)

- **Location**: `@libs/treatment-front/src/components/forms/treatment-validation.ts`
- **Relevance**: Shows how per-step Zod schemas are defined as factory functions using `(intl: IntlService) => object({...})`. Steps 3 and 4 follow the same factory function pattern.

### DraftTreatment Changeset

- **Location**: `@libs/treatment-front/src/changesets/treatment.ts`
- **Relevance**: The `DraftTreatment` interface already has `reasons`, `subReasons`, and `dataSubjectCategories`. We add `subjectCategoryPrecisions` following the same pattern as `subReasons`.

## Visual References

Archived screenshots for steps 3–4:
- `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/Step_3.jpeg` — Step 3 main view
- `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/Step_3_2.jpeg` — Step 3 sub-purposes modal
- `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/Step_4.jpeg` — Step 4 main view
- `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/Step_4_2.jpeg` — Step 4 precisions modal
