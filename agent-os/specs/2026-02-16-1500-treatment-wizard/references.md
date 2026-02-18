# References for Phase 1B: Core Treatment Management

## Overview

This document describes the project structure patterns to follow when implementing the treatment wizard (steps 1-2).

**IMPORTANT**: The library `@libs/treatment-front` (package name: `@libs/treatment-front`) already exists with a basic CRUD (list, create, edit, delete). This plan transforms it into a 2-step wizard.
- **No backend library needed** — treatment data stays entirely client-side (SQLite WASM)

The existing library follows the same patterns as `@libs/users-front` and `@libs/todos-front`.

---

## 1. Frontend Library Pattern

### Current + Target Structure: `@libs/treatment-front/`

```
@libs/treatment-front/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── treatment-form.gts          # Existing (simple form, kept for reference)
│   │   │   └── treatment-validation.ts     # Modify → per-step schemas
│   │   ├── wizard/                         # NEW
│   │   │   ├── treatment-wizard.gts        # NEW — Wizard container
│   │   │   ├── step-1-name.gts             # NEW — Step 1 component
│   │   │   └── step-2-general-info.gts     # NEW — Step 2 component
│   │   └── treatment-table.gts             # Existing (list view, unchanged)
│   ├── services/
│   │   └── treatment.ts                    # Modify → add new fields to update()
│   ├── routes/
│   │   └── dashboard/
│   │       └── treatments/
│   │           ├── index.gts               # Existing (unchanged)
│   │           ├── index-template.gts      # Existing (unchanged)
│   │           ├── create.gts              # Existing (unchanged)
│   │           ├── create-template.gts     # Modify → use wizard
│   │           ├── edit.gts                # Existing (unchanged)
│   │           └── edit-template.gts       # Modify → use wizard + all fields
│   ├── schemas/
│   │   └── treatments.ts                   # Modify → add step 2 fields
│   ├── changesets/
│   │   └── treatment.ts                    # Modify → add step 2 fields
│   ├── assets/icons/                       # Existing (edit, delete icons)
│   ├── http-mocks/
│   │   ├── all.ts                          # Existing (unchanged)
│   │   └── treatments.ts                   # Modify → add new fields to mocks
│   └── index.ts                            # Existing (unchanged)
├── package.json
├── tsconfig.json
├── rollup.config.mjs
└── vite.config.mts
```

### Key Exports from `src/index.ts`

Based on existing lib patterns (`@libs/users-front/src/index.ts`):

```typescript
import type Owner from '@ember/owner';
import type { DSL } from '@ember/routing/lib/dsl';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
  })();
}

export async function initialize(owner: Owner) {
  // No specific initialization needed for treatments
}

export function forRouter(this: DSL) {
  this.route('treatments', function () {
    this.route('create');
    this.route('edit', { path: '/:treatment_id/edit' });
  });
}
```

---

## 2. No Backend Library Needed

**Treatment data stays entirely client-side** — there is no backend integration for treatments.

### Why No Backend?

- **Privacy-First**: Sensitive GDPR compliance data never leaves the user's device
- **Offline-First**: Full functionality without network connectivity
- **SQLite WASM**: All treatment records stored locally in browser
- **User-Specific**: Each user maintains their own private treatment registry

### MSW Mocks Still Needed

Even without a backend, create MSW mock handlers in `@libs/treatment-front/http-mocks/` for:
- Development mode consistency (matches pattern from users/todos)
- Testing purposes

---

## 3. App Integration Points

### Router Configuration

**File**: `@apps/front/app/router.ts`

**Add for treatments**:
```typescript
import { forRouter as treatmentsLibRouter } from '@libs/treatment-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    userLibRouter.call(this);
    todosLibRouter.call(this);
    treatmentsLibRouter.call(this);  // Add this line
  });
  authRoutes.call(this);
});
```

### Application Route Initialization

**File**: `@apps/front/app/routes/application.ts`

**Add for treatments**:
```typescript
import { initialize as initializeTreatmentsLib } from '@libs/treatment-front';
import allTreatmentsHandlers from '@libs/treatment-front/http-mocks/all';

// In beforeModel():
await initializeTreatmentsLib(getOwner(this)!);

// In setupWorker:
const worker = setupWorker(
  ...allUsersHandlers,
  ...allTodosHandlers,
  ...allAuthHandlers,
  ...allTreatmentsHandlers,  // Add this
);
```

### Store Schema Registration

**File**: `@apps/front/app/services/store.ts`

**Add for treatments**:
```typescript
import TreatmentSchema from '@libs/treatment-front/schemas/treatments';

// In schemas array:
schemas: [UserSchema, TodoSchema, TreatmentSchema],
```

### Translation Files

**Location**: `@apps/front/translations/`

**Add for treatments**:
```
translations/
├── treatments/
│   ├── en-us.yaml
│   └── fr-fr.yaml
```

**Example translation keys** (`treatments/en-us.yaml`):
```yaml
treatments:
  wizard:
    step1:
      title: "Treatment Name"
      labels:
        name: "Treatment Name"
        type: "Treatment Type"
        description: "Description"
    step2:
      title: "General Identification"
      labels:
        entityName: "Entity Name"
        companyNumber: "Company Number"
        # ... etc
    navigation:
      previous: "Previous"
      next: "Next"
      save: "Save Draft"
      skip: "Skip"
      finish: "Finish"
      cancel: "Cancel"
      start: "Start"
```

---

## 4. Form Pattern Example

### Reference: User Form

**File**: `@libs/users-front/src/components/forms/user-form.gts`

**Key Patterns**:
- Validation schema factory function with `IntlService` injection
- TpkForm component with changeset binding
- HandleSaveService from `@libs/shared-front` for save operations
- Flash message on success
- Router transition after save

**Adaptation for Treatment Wizard**:
- Wizard has 2 separate validation schemas (one per step)
- Wizard manages navigation state (current step index)
- Validation runs per-step, not whole form at once
- Draft saving persists intermediate state

### Reference: Route Template

**File**: `@libs/todos-front/src/routes/dashboard/todos/create-template.gts`

**Pattern**:
```typescript
export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof createTodoValidationSchema>;
  changeset = new TodoChangeset({});

  constructor(owner: Owner, args: TodosCreateRouteSignature) {
    super(owner, args);
    this.validationSchema = createTodoValidationSchema(this.intl);
  }

  <template>
    <TodosForm @changeset={{this.changeset}} @validationSchema={{this.validationSchema}} />
  </template>
}
```

---

## 5. Data Flow

### Complete Client-Side Flow

```
1. User Input
   ↓
2. ImmerChangeset (immutable form state)
   ↓
3. Validation (Zod schema per step)
   ↓
4. Service.save(changeset)
   ↓
5. WarpDrive Store
   ↓
6. SQLite WASM (local storage)
```

**No Backend Sync**: Treatment data never leaves the browser.

### Service Method Pattern

```typescript
// treatment.service.ts
public async save(data: ValidatedTreatment) {
  if (data.id) {
    return this.update(data);
  } else {
    return this.create(data);
  }
}
```

---

## 6. Testing Patterns

### Component Testing

**Reference**: `@libs/users-front/src/components/forms/user-form.test.ts`

**Pattern**:
```typescript
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TestApp, initializeTestApp } from '../app.ts';

describe('TreatmentWizard', function() {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('renders step 1 fields', async function({ context }) {
    await initializeTestApp(context.owner, 'en-us');
    const changeset = new TreatmentChangeset({});

    await render(<template><TreatmentWizard @changeset={{changeset}} /></template>);

    // Assertions...
  });
});
```

### MSW Mocking

**Pattern**: Separate file per endpoint

```typescript
// http-mocks/all.ts
import createTreatment from './create-treatment';
import getTreatments from './get-treatments';
import updateTreatment from './update-treatment';

export default [createTreatment, getTreatments, updateTreatment];
```
