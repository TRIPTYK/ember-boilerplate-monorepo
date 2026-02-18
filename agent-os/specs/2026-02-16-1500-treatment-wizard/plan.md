# Phase 1B: Treatment Wizard — Implementation Plan (Steps 1-2)

## Context

This is the implementation plan for the treatment wizard, Phase 1B of the Registr application. It follows the completed Phase 1A authentication system.

### Starting Point

`@libs/treatment-front/` already exists with a basic CRUD (list, create, edit, delete) featuring a simple form (title + description). This plan transforms that simple form into a 2-step wizard.

**What already exists:**
- Library structure, package.json, index.ts, rollup/vite config
- Schema: `treatments` with `title`, `description`, `createdAt`, `updatedAt`
- Changeset: `DraftTreatment` with `id`, `title`, `description`
- Validation: `createTreatmentValidationSchema` / `editTreatmentValidationSchema` (title + description required)
- Form: `treatment-form.gts` — simple TpkForm with title input + description textarea
- Table: `treatment-table.gts` — sortable list with edit/delete actions
- Service: `treatment.ts` — save/create/update/delete via WarpDrive
- Routes: index, create, edit (with templates)
- MSW mocks: full CRUD with 3 mock treatments
- App integration: already wired into `@apps/front`

### Scope

**This release implements steps 1-2 only:**
1. **Treatment Name** — Title, type dropdown, description
2. **General Identification** — Responsible entity info, DPO toggle + form, external DPO toggle + form

Steps 3-8 (purposes, categories, data collected, legal basis, data sharing, security measures) are deferred to future releases.

### Architecture

- **Offline-first**: All treatment data stored client-side in SQLite WASM
- **No backend**: Treatment data never leaves the browser
- **Single changeset**: One ImmerChangeset for both steps
- **Step validation**: Zod schemas per step, blocking navigation on invalid
- **Draft saving**: Save progress at any time (uses `draftTreatmentSchema` — all fields optional)
- **Nested data model**: Treatment uses nested objects (`responsible.address.*`, `DPO.address.*`) — not flat fields

### Data Model

The treatment entity uses a **nested Zod schema** with reusable sub-schemas:

```
addressSchema        → { streetAndNumber, postalCode, city, country, phone, email }
contactInfoSchema    → { fullName, entityNumber?, address }
dataWithInfoSchema   → { name, additionalInformation? }
```

**Steps 1-2 fields (from `treatmentSchema`):**

```
Step 1:
  - title: string (required)
  - description: string (optional)
  - treatmentType: string (optional)

Step 2:
  - responsible: contactInfoSchema (required)
      → fullName, entityNumber?, address { streetAndNumber, postalCode, city, country, phone, email }
  - hasDPO: boolean
  - DPO: contactInfoSchema (optional, present only when hasDPO=true)
      → fullName, address { streetAndNumber, postalCode, city, country, phone, email }
  - hasExternalDPO: boolean
  - externalOrganizationDPO: contactInfoSchema (optional, present only when hasExternalDPO=true)
      → fullName, entityNumber?, address { streetAndNumber, postalCode, city, country, phone, email }
```

**Draft variant** (`draftTreatmentSchema`): Same structure but all fields optional — allows saving incomplete forms.

**Preprocess logic**: When `hasDPO=false`, `DPO` is stripped. When `hasExternalDPO=false`, `externalOrganizationDPO` is stripped. When `areDataExportedOutsideEU=false`, `recipient` is stripped.

---

## Task 1: Add Zod Schemas

**File**: `@libs/treatment-front/src/components/forms/treatment-validation.ts`

**Current**: Simple flat schemas (`createTreatmentValidationSchema` / `editTreatmentValidationSchema`)

**Replace with** the full Zod schema set (provided by product). This file defines:

1. **Reusable sub-schemas:**
   - `addressSchema` / `draftAddressSchema`
   - `contactInfoSchema` / `draftContactInfoSchema` / `draftDPOContactInfoSchema`
   - `dataWithInfoSchema` / `draftDataWithInfoSchema`
   - `recipientSchema` / `draftRecipientSchema`
   - `legalBaseSchema` / `draftLegalBaseSchema`

2. **Main schemas:**
   - `treatmentSchema` — Full validated treatment (with preprocess for conditional DPO/export)
   - `draftTreatmentSchema` — Partial treatment (all fields optional, for draft saving)
   - `treatmentResponseSchema` — API response shape (includes metadata: id, creationDate, status, order, isOverDueDate)
   - `draftTreatmentResponseSchema` — Draft API response

3. **Exported types:**
   - `TreatmentData = Omit<TypeOf<typeof treatmentSchema>, 'id' | 'dueDateForUpdate'>`
   - `DraftTreatmentData = Omit<TypeOf<typeof draftTreatmentSchema>, 'id' | 'dueDateForUpdate'>`

4. **Per-step validation helpers** (new, derived from the main schemas):
   - `step1Schema` — Picks `title`, `description`, `treatmentType` from `draftTreatmentSchema`, makes `title` required
   - `step2Schema` — Picks `responsible`, `hasDPO`, `DPO`, `hasExternalDPO`, `externalOrganizationDPO` from `draftTreatmentSchema`, makes `responsible.fullName` and `responsible.address` required

---

## Task 2: Extend WarpDrive Schema

**File**: `@libs/treatment-front/src/schemas/treatments.ts`

**Current**: Only `title`, `description`, `createdAt`, `updatedAt`

The treatment data is nested (objects within objects). Since WarpDrive attributes are flat by default, we store the treatment data as a **single JSON attribute** `data` that contains the nested structure, alongside top-level metadata fields.

```typescript
const treatmentSchema = withDefaults({
  type: 'treatments',
  fields: [
    { name: 'creationDate', kind: 'attribute' },
    { name: 'updateDate', kind: 'attribute' },
    { name: 'dueDateForUpdate', kind: 'attribute' },
    { name: 'status', kind: 'attribute' },
    { name: 'order', kind: 'attribute' },
    { name: 'isOverDueDate', kind: 'attribute' },
    { name: 'data', kind: 'attribute' },  // nested JSON: { title, description, responsible, DPO, ... }
  ],
});
```

This matches the `treatmentResponseSchema` which wraps the treatment fields inside a `data` object alongside metadata.

---

## Task 3: Extend Changeset

**File**: `@libs/treatment-front/src/changesets/treatment.ts`

**Current**: Flat `DraftTreatment` with `id`, `title`, `description`

**Update** to match `DraftTreatmentData` structure:

```typescript
export interface DraftTreatment {
  id?: string | null;
  title?: string;
  description?: string;
  treatmentType?: string;
  // Step 2
  responsible?: {
    fullName?: string;
    entityNumber?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  hasDPO?: boolean;
  DPO?: {
    fullName?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  hasExternalDPO?: boolean;
  externalOrganizationDPO?: {
    fullName?: string;
    entityNumber?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  // Future steps (included now for schema completeness)
  reasons?: string[];
  subReasons?: { name?: string; additionalInformation?: string }[];
  legalBase?: { name?: string; additionalInformation?: string }[];
  // ... other step 3-8 fields as per draftTreatmentSchema
}
```

ImmerChangeset handles nested objects natively via Immer — `changeset.set('responsible.fullName', 'Servais')` works.

---

## Task 4: Create Wizard Step Components

### 4.1 Step 1 — `src/components/wizard/step-1-name.gts`

**Visual reference**: `visuals/Step_1.jpeg`

**Fields:**
- Title — `TpkInputPrefab` with `@validationField="title"` (required)
- Treatment type — dropdown/select with `@validationField="treatmentType"` (options like "Ressources Humaines")
- Description — `TpkTextareaPrefab` with `@validationField="description"`

**Args**: receives changeset from parent wizard

### 4.2 Step 2 — `src/components/wizard/step-2-general-info.gts`

**Visual reference**: `visuals/Step_2.jpeg`, `visuals/Step_2_Paramater.jpeg`

**Three-panel layout with nested fields:**

**Left panel — Responsible (entity identification):**
- `responsible.fullName` — Entity name
- `responsible.entityNumber` — Company number
- `responsible.address.streetAndNumber` — Address
- `responsible.address.postalCode` — Postal code
- `responsible.address.city` — City
- `responsible.address.country` — Country
- `responsible.address.phone` — Phone
- `responsible.address.email` — Email
- Note: "Les informations du responsable du traitement ne peuvent pas être modifiées"

**Center panel — DPO:**
- Toggle: `hasDPO` — "Nous travaillons avec un DPO"
- If true, show DPO form:
  - `DPO.fullName`
  - `DPO.address.streetAndNumber`
  - `DPO.address.postalCode`
  - `DPO.address.city`
  - `DPO.address.country`
  - `DPO.address.phone`
  - `DPO.address.email`

**Right panel — External DPO:**
- Toggle: `hasExternalDPO` — "Le DPO est externe à la société"
- If true, show external organization form:
  - `externalOrganizationDPO.fullName`
  - `externalOrganizationDPO.entityNumber`
  - `externalOrganizationDPO.address.streetAndNumber`
  - `externalOrganizationDPO.address.postalCode`
  - `externalOrganizationDPO.address.city`
  - `externalOrganizationDPO.address.country`
  - `externalOrganizationDPO.address.phone`
  - `externalOrganizationDPO.address.email`

**Note**: The three panels share the same address field pattern — consider an `AddressFields` sub-component.

---

## Task 5: Create Wizard Container

### File: `src/components/wizard/treatment-wizard.gts`

**Manages:**
- Current step state (1 or 2)
- Progress indicator (2 numbered circles)
- Navigation buttons
- Validation before navigation via per-step Zod schemas
- Draft saving via `draftTreatmentSchema`

**Navigation logic:**
- Step 1: ANNULER (→ treatments list), COMMENCER (validate step 1 → step 2)
- Step 2: PRÉCÉDENT (→ step 1), ENREGISTRER (save draft via `draftTreatmentSchema`), PASSER (skip), TERMINER (validate step 2 → save → redirect)

**Validation:**
- Before COMMENCER: validate with `step1Schema`
- Before TERMINER: validate with `step2Schema`
- ENREGISTRER: validate with `draftTreatmentSchema` (permissive — all optional)

---

## Task 6: Update Route Templates

### 6.1 Create Template — `src/routes/dashboard/treatments/create-template.gts`

**Current**: Renders `TreatmentsForm` with changeset + validationSchema

**Replace with**: Renders `TreatmentWizard` with changeset, onSave, onFinish handlers

### 6.2 Edit Template — `src/routes/dashboard/treatments/edit-template.gts`

**Current**: Populates changeset with `id`, `title`, `description` from model

**Update to**: Populate changeset with all nested fields from model (`data.title`, `data.responsible`, `data.DPO`, etc.), then render `TreatmentWizard`

### Keep existing routes unchanged:
- `create.gts` — empty route (no change)
- `edit.gts` — findRecord by treatment_id (no change)
- `index.gts` + `index-template.gts` — treatment table (no change)

---

## Task 7: Update Treatment Service

**File**: `@libs/treatment-front/src/services/treatment.ts`

**Current**: `update()` only assigns `title` and `description`

**Update**: The service now handles the nested data structure. The `save()` method receives a `DraftTreatmentData` or `TreatmentData` object and persists it via WarpDrive store.

---

## Task 8: Update MSW Mocks

**File**: `@libs/treatment-front/src/http-mocks/treatments.ts`

**Current**: Mock data only has `title` and `description` attributes

**Update**: Mock responses must match `treatmentResponseSchema` / `draftTreatmentResponseSchema`:

```typescript
{
  id: '1',
  creationDate: '2026-01-15',
  updateDate: '2026-02-10',
  status: 'draft',
  order: 1,
  isOverDueDate: false,
  data: {
    title: 'Gestion des ressources humaines',
    description: 'Traitement des données RH pour le recrutement',
    treatmentType: 'Ressources Humaines',
    responsible: {
      fullName: 'Servais SA',
      entityNumber: 'BE 0412.589.401',
      address: {
        streetAndNumber: 'Rue de la Loi 42',
        postalCode: '1000',
        city: 'Bruxelles',
        country: 'Belgique',
        phone: '+32 2 123 45 67',
        email: 'contact@servais.be',
      },
    },
    hasDPO: true,
    DPO: {
      fullName: 'Jean Dupont',
      address: {
        streetAndNumber: 'Avenue Louise 100',
        postalCode: '1050',
        city: 'Ixelles',
        country: 'Belgique',
        phone: '+32 2 987 65 43',
        email: 'dpo@servais.be',
      },
    },
    hasExternalDPO: false,
    reasons: [],
    subReasons: [],
    // ... other step 3-8 fields as empty defaults
  },
}
```

---

## Task 9: Update Translations

**Files**:
- `@apps/front/translations/treatments/en-us.yaml`
- `@apps/front/translations/treatments/fr-fr.yaml`

**Add keys for:**
- `treatments.wizard.step1.title`, `treatments.wizard.step1.labels.*`, `treatments.wizard.step1.validation.*`
- `treatments.wizard.step2.title`, `treatments.wizard.step2.labels.*` (responsible, DPO, externalOrganizationDPO, address fields)
- `treatments.wizard.step2.validation.*`
- `treatments.wizard.navigation.*` (previous, next, save, skip, finish, cancel, start)

---

## Task 10: Tests

### 10.1 Component Tests

- **step-1-name.test.ts** — Renders 3 fields, validates title required
- **step-2-general-info.test.ts** — Renders responsible form, DPO toggle shows/hides form, external DPO toggle, nested field paths work
- **treatment-wizard.test.ts** — Navigation between steps, validation blocking, progress indicator

### 10.2 Integration Tests

- Create flow: fill step 1 → navigate to step 2 → fill step 2 → finish
- Edit flow: load existing treatment → modify nested fields → save
- Draft saving: partially fill → save → verify persistence with draftTreatmentSchema
- Conditional stripping: hasDPO=false → DPO data stripped on final save

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `src/components/forms/treatment-validation.ts` | **Rewrite** — Full Zod schema set (nested, draft, response, per-step) |
| `src/schemas/treatments.ts` | Extend — metadata fields + `data` JSON attribute |
| `src/changesets/treatment.ts` | Extend — nested `DraftTreatment` interface |
| `src/components/wizard/step-1-name.gts` | **New** — Step 1 component |
| `src/components/wizard/step-2-general-info.gts` | **New** — Step 2 component |
| `src/components/wizard/treatment-wizard.gts` | **New** — Wizard container |
| `src/routes/dashboard/treatments/create-template.gts` | Update — use wizard |
| `src/routes/dashboard/treatments/edit-template.gts` | Update — use wizard + nested fields |
| `src/services/treatment.ts` | Update — handle nested data structure |
| `src/http-mocks/treatments.ts` | Update — nested mock data matching response schema |
| `translations/treatments/en-us.yaml` | Add wizard + nested field keys |
| `translations/treatments/fr-fr.yaml` | Add wizard + nested field keys |

**Unchanged**: index.ts, package.json, routes (create.gts, edit.gts, index.gts), treatment-table.gts, icons, config files

---

## Success Criteria

- [ ] Full Zod schema set in place (treatment, draft, response, per-step)
- [ ] Step 1 renders and validates (title required)
- [ ] Step 2 renders with nested forms (responsible, DPO, external DPO)
- [ ] DPO/external DPO toggles conditionally show/hide forms
- [ ] Nested changeset paths work (`responsible.address.city`, `DPO.fullName`, etc.)
- [ ] Wizard navigation works (step 1 → step 2 → finish)
- [ ] Validation blocks navigation when step is invalid
- [ ] Draft saving persists with draftTreatmentSchema (all optional)
- [ ] Final save uses treatmentSchema with preprocess (strips DPO when disabled)
- [ ] Create and edit routes use wizard
- [ ] Treatment list (table) still works
- [ ] FR and EN translations provided
- [ ] Tests pass
