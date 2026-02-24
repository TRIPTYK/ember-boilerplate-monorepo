# References for Étape 6 Base légale

## Similar Implementations

### Step 3 — Finalités

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-3-purposes.gts`
- **Relevance:** Même structure : SearchableOptionsGroup + tracked customOptions + sélection via changeset
- **Key patterns:** `selectReason` / `removeReason` / `selectedReasons` getter / `@allowCustomValues`

### Step 4 — Catégories de personnes

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-4-categories.gts`
- **Relevance:** Même structure que step 3 avec `PrecisionsModal` en plus (non nécessaire pour step 6)

### SearchableOptionsGroup

- **Location:** `@libs/treatment-front/src/components/ui/searchable-options-group.gts`
- **Relevance:** Composant réutilisé directement — chips `badge badge-primary`, TpkSelectCreate
