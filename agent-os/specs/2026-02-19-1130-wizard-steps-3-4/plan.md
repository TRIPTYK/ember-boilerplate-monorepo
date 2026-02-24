# Wizard Steps 3 & 4 — Implementation Plan

## Context

The treatment wizard currently has 2 steps (Name + General Info). This plan adds Steps 3 (Finalités du traitement) and 4 (Catégories de personnes concernées) as specified in `SPECIFICATIONS_ETAPES_3_4_FORMULAIRE.md`. Both steps use a shared searchable multi-select chip pattern. Step 3 includes a sub-purposes modal; Step 4 includes a precisions modal. Custom values are kept in-memory only (settings persistence is deferred). Modals use `TpkModal` from `@triptyk/ember-ui`.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-02-19-1130-wizard-steps-3-4/` with:
- `plan.md` — this full plan
- `shape.md` — shaping notes
- `standards.md` — relevant standards
- `references.md` — reference implementations
- `visuals/README.md` — pointer to archived step 3/4 screenshots in `agent-os/specs/2026-02-16-1500-treatment-wizard/visuals/archived/`

---

## Task 2: Extend Zod Schemas

**File**: `@libs/treatment-front/src/components/forms/treatment-validation.ts`

**Add** `subjectCategoryPrecisions` to `treatmentSchema` and `draftTreatmentSchema`:
```typescript
subjectCategoryPrecisions: array(draftDataWithInfoSchema).optional(),
```

**Add** per-step schemas (always-valid — all fields optional):
```typescript
export const step3Schema = (_intl: IntlService) =>
  object({
    reasons: array(string()).optional(),
    subReasons: array(draftDataWithInfoSchema).optional(),
  });

export const step4Schema = (_intl: IntlService) =>
  object({
    dataSubjectCategories: array(string()).optional(),
    subjectCategoryPrecisions: array(draftDataWithInfoSchema).optional(),
  });
```

---

## Task 3: Update WarpDrive Schema + Changeset

**File**: `@libs/treatment-front/src/schemas/treatments.ts`

Add `subjectCategoryPrecisions` to the `TreatmentData` interface (optional `{ name?: string; additionalInformation?: string }[]`).

**File**: `@libs/treatment-front/src/changesets/treatment.ts`

Add `subjectCategoryPrecisions?: { name?: string; additionalInformation?: string }[]` to `DraftTreatment` interface.

---

## Task 4: Create `SearchableOptionsGroup` Component

**New file**: `@libs/treatment-front/src/components/wizard/searchable-options-group.gts`

**Signature**:
```typescript
interface SearchableOptionsGroupSignature {
  Args: {
    allOptions: string[];          // all available options (predefined + custom)
    selected: string[];            // currently selected
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
    allowCustomValues?: boolean;   // show "Ajouter: X" option
    placeholder?: string;
  }
}
```

**Internal state** (all `@tracked`):
- `searchQuery = ''`
- `popularOptions: string[]` — 4 random unselected options, fixed at construction (`constructor()`)
- `showDropdown = false`

**Key getters**:
- `availableOptions` — `allOptions` minus `selected`
- `filteredOptions` — `availableOptions` filtered by `searchQuery` (case-insensitive)
- `showCustomOption` — `allowCustomValues && searchQuery && !allOptions includes searchQuery`

**Actions**:
- `handleInput(e)` — updates `searchQuery`, shows dropdown
- `selectOption(value)` — calls `onSelect(value)`, clears `searchQuery`
- `addCustomValue()` — calls `onSelect(searchQuery)` if not already present, clears `searchQuery`

**Template sections**:
1. Search input (with autocomplete dropdown list below it)
2. Selected chips zone (blue chips with × button)
3. "Populaire" section (gray chips, max 4, from `popularOptions`)

---

## Task 5: Create Sub-Purposes Modal

**New file**: `@libs/treatment-front/src/components/wizard/sub-purposes-modal.gts`

**Uses**: `TpkModal` from `@triptyk/ember-ui`

**Signature**:
```typescript
interface SubPurposesModalSignature {
  Args: {
    isOpen: boolean;
    onClose: () => void;
    subReasons: { name?: string; additionalInformation?: string }[];
    onChange: (subReasons: { name?: string; additionalInformation?: string }[]) => void;
  }
}
```

**Internal state**:
- `localItems` — local copy of `subReasons` (initialized when modal opens via `{{did-update}}` or constructor)
- `isAddingNew = false`
- `newName = ''`
- `newDescription = ''`

**Actions**:
- `addItem()` — appends `{name: newName, additionalInformation: newDescription}` to `localItems`, resets fields
- `removeItem(index)` — removes from `localItems`
- `updateDescription(index, value)` — updates `localItems[index].additionalInformation`
- `save()` — calls `onChange(localItems)` then `onClose()`
- `cancel()` — calls `onClose()`

**Template**: Uses `<TpkModal @isOpen={{@isOpen}} @onClose={{@onClose}} @title="..." as |M|>` → `<M.Content>` for the body.

---

## Task 6: Create Category Precisions Modal

**New file**: `@libs/treatment-front/src/components/wizard/category-precisions-modal.gts`

**Signature**:
```typescript
interface CategoryPrecisionsModalSignature {
  Args: {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    precisions: { name?: string; additionalInformation?: string }[];
    onChange: (precisions: { name?: string; additionalInformation?: string }[]) => void;
  }
}
```

**Behavior**: Auto-generates one textarea per selected category. Precisions array is keyed by `name` (= category name). When `selectedCategories` changes (via `@selectedCategories`), ensures a precision entry exists for each category.

**Actions**:
- `updatePrecision(categoryName, value)` — finds or creates entry `{name: categoryName}`, sets `additionalInformation`
- `save()` / `cancel()` — same as sub-purposes modal

---

## Task 7: Create Step 3 Component

**New file**: `@libs/treatment-front/src/components/wizard/step-3-purposes.gts`

**Signature**:
```typescript
interface Step3Signature {
  Args: {
    changeset: treatmentChangeset;
  }
}
```

**Predefined options** (inline constant — 9 values):
`['Collecte de données', 'Gestion des utilisateurs', 'Marketing', 'Analyse', 'Conformité légale', 'Amélioration du service', 'Support client', 'Recherche', 'Sécurité']`

**Internal state**:
- `customOptions: string[] = []` — new values added during session
- `isModalOpen = false`

**Computed**:
- `allOptions` — predefined + `customOptions`
- `selectedReasons` — `changeset.data.reasons ?? []`
- `subReasons` — `changeset.data.subReasons ?? []`

**Actions**:
- `selectReason(value)` — if not in `allOptions`, push to `customOptions`; then add to `changeset.data.reasons`
- `removeReason(value)` — remove from `changeset.data.reasons`
- `updateSubReasons(newSubReasons)` — set `changeset.data.subReasons`

**Template**: Title "Étape 3 — Finalité(s) du traitement" + `<SearchableOptionsGroup>` + "Sous-finalités" button + `<SubPurposesModal>`

---

## Task 8: Create Step 4 Component

**New file**: `@libs/treatment-front/src/components/wizard/step-4-categories.gts`

**Predefined options** (10 values):
`['Clients', 'Employés', 'Fournisseurs', 'Partenaires', 'Prospects', 'Candidats', 'Visiteurs', 'Sous-traitants', 'Actionnaires', 'Formulaire de contact']`

**Same pattern as Step 3**, but:
- Binds to `changeset.data.dataSubjectCategories`
- Modal is "Précisions" → `<CategoryPrecisionsModal>` (passes `selectedCategories` + `changeset.data.subjectCategoryPrecisions`)
- `updatePrecisions(precisions)` → sets `changeset.data.subjectCategoryPrecisions`

---

## Task 9: Extend TreatmentWizard to 4 Steps

**File**: `@libs/treatment-front/src/components/wizard/treatment-wizard.gts`

**Changes**:

1. **Import** `Step3Purposes` and `Step4Categories`

2. **Add step schemas**:
```typescript
get step3ValidationSchema() { return step3Schema(this.intl); }
get step4ValidationSchema() { return step4Schema(this.intl); }
```

3. **Update `currentValidationSchema`** — switch on `currentStep` (1→step1, 2→step2, 3→step3, 4→step4)

4. **Add getters**:
```typescript
get isStep3() { return this.currentStep === 3; }
get isStep4() { return this.currentStep === 4; }
get canGoNext() { return this.currentStep < 4; }
get isLastStep() { return this.currentStep === 4; }
```

5. **Update `validateCurrentStep`** — add `step3`/`step4` branches

6. **Update `handleFinish` trigger** — `@onSubmit={{if this.isLastStep this.handleFinish this.goToNextStep}}`

7. **Template — progress indicator**: Add step 3 and step 4 circles (same pattern as step 1/2)

8. **Template — content**:
```hbs
{{#if this.isStep3}}
  <Step3Purposes @changeset={{@changeset}} />
{{else if this.isStep4}}
  <Step4Categories @changeset={{@changeset}} />
{{/if}}
```

9. **Template — navigation buttons**: Change `{{#if this.isStep2}}` for SaveDraft/Skip to `{{#unless this.isStep1}}` (applies to steps 2, 3, 4). The submit/finish button already uses `{{if this.isStep2 this.handleFinish ...}}` → change to `{{if this.isLastStep this.handleFinish this.goToNextStep}}`.

---

## Task 10: Update Translations

**Files**:
- `@apps/front/translations/treatments/en-us.yaml`
- `@apps/front/translations/treatments/fr-fr.yaml`

**Add under `wizard:`**:

```yaml
step3:
  title: 'Treatment Purposes'           # FR: 'Finalité(s) du traitement'
  labels:
    searchPlaceholder: 'Search or add a purpose...'   # FR: 'Rechercher ou ajouter une finalité...'
    popular: 'Popular'                  # FR: 'Populaire'
    selected: 'Selected purposes'       # FR: 'Finalités sélectionnées'
    subPurposes: 'Sub-purposes'         # FR: 'Sous-finalités'
    addSubPurpose: 'Add a sub-purpose'  # FR: 'Ajouter une sous-finalité'
    subPurposeName: 'Sub-purpose name'  # FR: 'Nom de la sous-finalité'
    subPurposeDescription: 'Description for {name}'  # FR: 'Description pour {name}'
    save: 'Save'                        # FR: 'Enregistrer'
    cancel: 'Cancel'                    # FR: 'Annuler'

step4:
  title: 'Data Subject Categories'      # FR: 'Catégories de personnes concernées'
  labels:
    searchPlaceholder: 'Search or add a category...'  # FR: 'Rechercher ou ajouter une catégorie...'
    popular: 'Popular'                  # FR: 'Populaire'
    selected: 'Selected categories'     # FR: 'Catégories sélectionnées'
    precisions: 'Precisions'            # FR: 'Précisions'
    save: 'Save'                        # FR: 'Enregistrer'
    cancel: 'Cancel'                    # FR: 'Annuler'

progress:
  step3: 'Purposes'                    # FR: 'Finalités'  (add to existing)
  step4: 'Data Subjects'              # FR: 'Personnes concernées'  (add to existing)
```

Also update `navigation.next` key if not already present (it is, value 'Next'/'Suivant').

---

## Files Modified Summary

| File | Action |
|------|--------|
| `src/components/forms/treatment-validation.ts` | Add step3Schema, step4Schema, subjectCategoryPrecisions |
| `src/schemas/treatments.ts` | Add subjectCategoryPrecisions to TreatmentData interface |
| `src/changesets/treatment.ts` | Add subjectCategoryPrecisions to DraftTreatment |
| `src/components/wizard/searchable-options-group.gts` | **New** — shared multi-select chip component |
| `src/components/wizard/sub-purposes-modal.gts` | **New** — sub-purposes TpkModal |
| `src/components/wizard/category-precisions-modal.gts` | **New** — precisions TpkModal |
| `src/components/wizard/step-3-purposes.gts` | **New** — Step 3 component |
| `src/components/wizard/step-4-categories.gts` | **New** — Step 4 component |
| `src/components/wizard/treatment-wizard.gts` | Extend to 4 steps |
| `translations/treatments/en-us.yaml` | Add step3, step4, progress keys |
| `translations/treatments/fr-fr.yaml` | Add step3, step4, progress keys |

---

## Key Patterns to Follow

- **Import alias**: Use `#src/` instead of relative paths
- **File extension**: `.gts` for all template components
- **Changeset mutation**: Use `changeset.set('reasons', [...])` for array updates (ImmerChangeset handles immutability)
- **TpkModal usage**: `<TpkModal @isOpen={{...}} @onClose={{...}} @title={{...}} as |M|><M.Content>...</M.Content></TpkModal>`
- **Translations**: All labels via `{{t "treatments.wizard.step3.labels.xxx"}}`

---

## Verification

1. Navigate to create/edit treatment → wizard shows 4 steps in progress bar
2. Step 2 now shows "Suivant" (not Terminer)
3. Step 3: click a popular chip → appears as blue chip; search filters options; "Ajouter: X" appears for unknown values; X button removes chips; "Sous-finalités" button opens modal; modal CRUD works; Enregistrer closes modal
4. Step 4: same chip behavior for categories; "Précisions" button opens modal; one textarea per selected category; save closes modal
5. Step 4: click Terminer → wizard finishes, changeset includes reasons, subReasons, dataSubjectCategories, subjectCategoryPrecisions
6. Draft save at any step preserves all 4 step data
7. Edit route loads existing reasons/categories and displays pre-selected chips
