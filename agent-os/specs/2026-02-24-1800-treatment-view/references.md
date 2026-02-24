# References — Vue d'un traitement

## Similar Implementations

### edit-template.gts — Route template pattern

- **Location:** `@libs/treatment-front/src/routes/dashboard/treatments/edit-template.gts`
- **Relevance:** Pattern class Component + services + handleBack/handleEdit
- **Key patterns:** `@service declare router`, `router.transitionTo('dashboard.treatments')`

### status-chip.gts — Badge DaisyUI

- **Location:** `@libs/treatment-front/src/components/tables/ui/status-chip.gts`
- **Relevance:** Mapping status → badge class DaisyUI
- **Key patterns:** `badge badge-sm badge-warning/success/error/ghost`

### searchable-options-group-data.gts — Lock icon SVG

- **Location:** `@libs/treatment-front/src/components/ui/searchable-options-group-data.gts`
- **Relevance:** Heroicons lock-closed SVG pour données sensibles
- **Key patterns:** Inline SVG avec `class="w-5 h-5 text-error"`
