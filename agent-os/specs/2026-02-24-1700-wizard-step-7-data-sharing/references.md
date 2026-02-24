# References — Étape 7 : Partage des données

## Similar Implementations

### Step 4 (Categories) — SearchableOptionsGroup + PrecisionsModal

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-4-categories.gts`
- **Relevance:** Même pattern SearchableOptionsGroup + PrecisionsModal utilisé pour sections 1 & 2
- **Key patterns:** `@tracked isModalOpen`, `updatePrecisions` qui set dans le changeset, `TpkButtonComponent` pour ouvrir la modale

### Step 5 (Data) — TpkInputPrefab dot-notation + @form

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-5-data.gts`
- **Relevance:** `@form.TpkInputPrefab @validationField="personalDataGroup.conservationDuration"` — même pattern pour `recipient.fullName` etc.
- **Key patterns:** `WithBoundArgs<typeof TpkInputPrefabComponent, 'changeset' | 'mandatory'>` dans la signature

### Step 6 (Legal Basis) — SearchableOptionsGroup sans @form

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-6-legal-basis.gts`
- **Relevance:** Pattern array d'objets {name, additionalInformation} ↔ string[] conversion
- **Key patterns:** `selectedLegalBaseNames`, `selectLegalBase`, `removeLegalBase`

### PrecisionsModal

- **Location:** `@libs/treatment-front/src/components/ui/precisions-modal.gts`
- **Relevance:** Modal de précisions réutilisable pour sections 1 & 2
- **Key patterns:** `@options` (string[]), `@values` ({name, additionalInformation}[]), `@onChange`

### SearchableOptionsGroup

- **Location:** `@libs/treatment-front/src/components/ui/searchable-options-group.gts`
- **Relevance:** Composant de sélection multiple avec recherche
- **Key patterns:** `badge badge-primary` pour les chips, `@allowCustomValues={{true}}`
