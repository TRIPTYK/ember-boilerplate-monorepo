# References for Wizard Step 5 — Données

## Similar Implementations

### Step 3 — Finalités (step-3-purposes.gts)

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-3-purposes.gts`
- **Relevance:** Pattern de base pour un step avec `SearchableOptionsGroup` + modale. Step 5 section 3 (sources) suit exactement ce pattern.
- **Key patterns:**
  - `PREDEFINED_*` array de strings hardcodé
  - `@tracked customOptions: string[]` pour les options ajoutées en session
  - `get allOptions()` = prédéfinies + custom
  - `get selectedReasons()` lit depuis le changeset
  - `selectReason()` / `removeReason()` met à jour le changeset
  - Bouton d'ouverture de modale avec `TpkButtonPrefabComponent`

### Step 4 — Catégories (step-4-categories.gts)

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-4-categories.gts`
- **Relevance:** Identique à step 3 mais avec `PrecisionsModal`. La section 3 de l'étape 5 (sources des données) suit ce même pattern avec `PrecisionsModal`.
- **Key patterns:**
  - `get precisions()` lit `subjectCategoryPrecisions` du changeset
  - `updatePrecisions()` met à jour le changeset
  - `PrecisionsModal` reçoit `@options={{this.selectedCategories}}` et `@values={{this.precisions}}`

### SearchableOptionsGroup (searchable-options-group.gts)

- **Location:** `@libs/treatment-front/src/components/ui/searchable-options-group.gts`
- **Relevance:** Composant de base pour la recherche + chips. Le nouveau `SearchableOptionsGroupData` en sera une variante avec gestion de la sensibilité.
- **Key patterns:**
  - `TpkSelectCreate` avec `@multiple={{true}}`, `@searchEnabled={{true}}`, `@showCreateWhen`
  - Chips rendus manuellement avec bouton de suppression
  - `handleChange` reçoit `unknown[]`, extrait `[0]`
  - `handleCreate` pour les valeurs personnalisées

### PrecisionsModal (precisions-modal.gts)

- **Location:** `@libs/treatment-front/src/components/ui/precisions-modal.gts`
- **Relevance:** Directement réutilisé pour la section 3 (sources des données avec précisions optionnelles).
- **Key patterns:**
  - `TpkModal` + `TpkTextarea` par option
  - `getPrecisionForOption(name)` cherche dans `values`
  - `updatePrecision(name, value)` met à jour ou crée l'entrée
  - `@options: string[]` = liste des noms sélectionnés
  - `@values: { name?, additionalInformation? }[]` = précisions actuelles

### Step 2 — Identification générale (step-2-general-info.gts)

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form/step-2-general-info.gts`
- **Relevance:** Layout 3 colonnes côte à côte. Step 5 utilise le même gabarit flex row.
- **Key patterns:**
  - `class="grid grid-cols-3 gap-4"` ou flexbox row pour les 3 sections
  - Chaque section dans une card/div indépendante

### TreatmentForm (treatment-form.gts)

- **Location:** `@libs/treatment-front/src/components/forms/treatment-form.gts`
- **Relevance:** Orchestrateur du formulaire multi-étapes. Doit être mis à jour pour intégrer step 5.
- **Key patterns à mettre à jour:**
  - `currentStep` initialisé depuis URL (étendre la plage à `1-5`)
  - `steps[]` array : ajouter step 5
  - `getStepStatus` : inchangé
  - `get isLastStep()` : `return this.currentStep === 5`
  - `get canGoNext()` : `return this.currentStep < 5`
  - `currentValidationSchema` : ajouter `case 5: return this.step5ValidationSchema`
  - `validateCurrentStep()` : ajouter `else if (this.currentStep === 5) { ... step5 data }`
  - Template : ajouter `{{#if this.isStep5}}<Step5Data @changeset={{@changeset}} />{{/if}}`

### Treatment Changeset (changesets/treatment.ts)

- **Location:** `@libs/treatment-front/src/changesets/treatment.ts`
- **Relevance:** Interface `DraftTreatment` à mettre à jour avec les nouveaux champs de step 5.
- **Champs actuels incorrects (à remplacer):**
  - `personalData?: { name?: string; additionalInformation?: string }[]`
  - `financialData?: { name?: string; additionalInformation?: string }[]`
  - `dataSource?: string[]`

### Treatment Validation (components/forms/treatment-validation.ts)

- **Location:** `@libs/treatment-front/src/components/forms/treatment-validation.ts`
- **Relevance:** Ajouter `step5Schema()` et mettre à jour `draftTreatmentSchema`/`treatmentSchema` avec les nouveaux champs.
