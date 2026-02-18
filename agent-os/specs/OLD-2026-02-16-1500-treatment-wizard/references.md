# References for Phase 1B: Core Treatment Management

## Overview

This document describes the project structure patterns to follow when implementing the treatment wizard.

**IMPORTANT**: You will need to create one new library:
- `@libs/treatment-front` — Frontend wizard components, routes, and services
- **No backend library needed** — treatment data stays entirely client-side (SQLite WASM)

Since there is no existing treatment management code, we reference the patterns established by `@libs/users-front` and `@libs/todos-front` as templates for structuring this new library.

---

## 1. Frontend Library Pattern

### Expected Structure: `@libs/treatment-front/`

```
@libs/treatment-front/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── treatment-form.gts
│   │   │   └── treatment-validation.ts
│   │   ├── wizard/
│   │   │   ├── treatment-wizard.gts
│   │   │   ├── step-1-name.gts
│   │   │   ├── step-2-general-info.gts
│   │   │   ├── step-3-purposes.gts
│   │   │   ├── step-4-categories.gts
│   │   │   ├── step-5-data.gts
│   │   │   ├── step-6-legal-basis.gts
│   │   │   ├── step-7-sharing.gts
│   │   │   └── step-8-security.gts
│   │   └── shared/
│   │       ├── searchable-tag-input.gts
│   │       ├── precisions-modal.gts
│   │       ├── sub-purposes-modal.gts
│   │       └── retention-period-selector.gts
│   ├── services/
│   │   └── treatment.ts
│   ├── routes/
│   │   └── dashboard/
│   │       └── treatments/
│   │           ├── index.gts
│   │           ├── index-template.gts
│   │           ├── create.gts
│   │           ├── create-template.gts
│   │           ├── edit.gts
│   │           └── edit-template.gts
│   ├── schemas/
│   │   └── treatments.ts
│   ├── changesets/
│   │   └── treatment.ts
│   ├── http-mocks/
│   │   ├── all.ts
│   │   ├── get-treatments.ts
│   │   ├── create-treatment.ts
│   │   └── update-treatment.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Key Exports from `src/index.ts`

Based on existing lib patterns:

```typescript
import type { Owner } from '@ember/-internals/owner';
import type { DSL } from '@ember/routing';

/**
 * Register all module components, services, and routes
 */
export function moduleRegistry() {
  return {
    'component:treatments/wizard': () => import('./components/wizard/treatment-wizard.gts'),
    'component:treatments/form': () => import('./components/forms/treatment-form.gts'),
    'service:treatment': () => import('./services/treatment.ts'),
    // ... other registrations
  };
}

/**
 * Initialize the treatments library
 * Called from @apps/front/app/routes/application.ts
 */
export async function initialize(owner: Owner) {
  // Register services if needed
  // Set up any initial state
}

/**
 * Register routes under the dashboard
 * Called from @apps/front/app/router.ts
 */
export function forRouter(this: DSL) {
  this.route('treatments', function() {
    this.route('create');
    this.route('edit', { path: '/:treatment_id/edit' });
  });
}
```

### Reference: `@libs/users-front/src/index.ts`

**Location**: `@libs/users-front/src/index.ts`

**Pattern**: Exports `moduleRegistry()`, `initialize()`, `forRouter()`, and `authRoutes()`

**Key Learnings**:
- `moduleRegistry()` returns object with lazy-loaded component/service factories
- `initialize()` sets up library-specific services
- `forRouter()` defines nested routes under dashboard
- Routes use dynamic segments like `/:user_id/edit`

---

## 2. No Backend Library Needed

**Treatment data stays entirely client-side** — there is no backend integration for treatments.

### Why No Backend?

- **Privacy-First**: Sensitive GDPR compliance data never leaves the user's device
- **Offline-First**: Full functionality without network connectivity
- **SQLite WASM**: All treatment records stored locally in browser
- **User-Specific**: Each user maintains their own private treatment registry

### What This Means

- ✅ No `@libs/treatments-backend` library
- ✅ No treatment API endpoints
- ✅ No PostgreSQL tables for treatments
- ✅ No JSON:API serializers for treatments
- ✅ Treatment data persists only in browser's SQLite WASM database

### MSW Mocks Still Needed

Even without a backend, you'll still create MSW mock handlers in `@libs/treatment-front/http-mocks/` for:
- Development mode consistency (matches pattern from users/todos)
- Potential future export/import features
- Testing purposes

But these mocks won't call any real backend — they'll interact with SQLite WASM directly.

---

## 3. App Integration Points

### Router Configuration

**File**: `@apps/front/app/router.ts`

**Current Pattern**:
```typescript
import { forRouter as userLibRouter } from '@libs/users-front';
import { forRouter as todosLibRouter } from '@libs/todos-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    userLibRouter.call(this);
    todosLibRouter.call(this);
  });
  authRoutes.call(this);
});
```

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

**Current Pattern**:
```typescript
import { initialize as initializeUsersLib } from '@libs/users-front';
import { initialize as initializeTodosLib } from '@libs/todos-front';
import allUsersHandlers from '@libs/users-front/http-mocks/all';
import allTodosHandlers from '@libs/todos-front/http-mocks/all';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    // Initialize libs
    await initializeUsersLib(getOwner(this)!);
    await initializeTodosLib(getOwner(this)!);

    // Setup MSW worker
    const worker = setupWorker(
      ...allUsersHandlers,
      ...allTodosHandlers,
    );
    await worker.start();
  }
}
```

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
  ...allTreatmentsHandlers,  // Add this
);
```

### Store Schema Registration

**File**: `@apps/front/app/services/store.ts`

**Current Pattern**:
```typescript
import UserSchema from '@libs/users-front/schemas/users';
import TodoSchema from '@libs/todos-front/schemas/todos';

export default class StoreService extends BaseStoreService {
  constructor(args: EmberOwner) {
    super(args);
    useLegacyStore(this, {
      schemas: [UserSchema, TodoSchema],
    });
  }
}
```

**Add for treatments**:
```typescript
import TreatmentSchema from '@libs/treatment-front/schemas/treatments';

// In schemas array:
schemas: [UserSchema, TodoSchema, TreatmentSchema],
```

### Translation Files

**Location**: `@apps/front/app/translations/`

**Current Structure**:
```
app/translations/
├── users/
│   ├── en-us.yaml
│   └── fr-fr.yaml
├── todos/
│   ├── en-us.yaml
│   └── fr-fr.yaml
├── dashboard/
│   ├── en-us.yaml
│   └── fr-fr.yaml
└── global/
    ├── en-us.yaml
    └── fr-fr.yaml
```

**Add for treatments**:
```
app/translations/
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
      # ... etc
    navigation:
      previous: "Previous"
      next: "Next"
      save: "Save Draft"
      skip: "Skip"
      finish: "Finish"
```

---

## 4. Form Pattern Example

### Reference: User Form

**File**: `@libs/users-front/src/components/forms/user-form.gts`

**Key Patterns**:
- Validation schema factory function with `IntlService` injection
- TpkForm component with changeset binding
- Service injection for save operations
- Flash message on success
- Router transition after save

**Structure**:
```typescript
export default class UserForm extends Component<UserFormArgs> {
  @service declare user: UserService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  get validationSchema() {
    return createUserValidationSchema(this.intl);
  }

  onSubmit = async (data, changeset) => {
    await this.user.save(changeset);
    await this.router.transitionTo('dashboard.users');
    this.flashMessages.success(this.intl.t('users.forms.user.messages.saveSuccess'));
  };

  <template>
    <TpkForm @changeset={{@changeset}} @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}} data-test-users-form as |F|>
      <!-- Form fields -->
    </TpkForm>
  </template>
}
```

**Validation File**: `@libs/users-front/src/components/forms/user-validation.ts`

**Pattern**:
```typescript
export const createUserValidationSchema = (intl: IntlService) =>
  object({
    email: string(intl.t('users.forms.user.validation.emailRequired'))
      .email(intl.t('users.forms.user.validation.emailInvalid')),
    firstName: string(intl.t('users.forms.user.validation.firstNameRequired')),
    lastName: string(intl.t('users.forms.user.validation.lastNameRequired')),
  });
```

### Adaptation for Treatment Wizard

**Key Differences**:
- Wizard has 8 separate validation schemas (one per step)
- Wizard manages navigation state (current step index)
- Validation runs per-step, not whole form at once
- Draft saving persists intermediate state

---

## 5. Data Flow

### Complete Client-Side Flow

```
1. User Input
   ↓
2. ImmerChangeset (immutable form state)
   ↓
3. Validation (Zod schema)
   ↓
4. Service.save(changeset)
   ↓
5. WarpDrive Store
   ↓
6. SQLite WASM (local storage)
```

**No Backend Sync**: Treatment data never leaves the browser. All persistence is through SQLite WASM running in WebAssembly within the user's browser.

### Service Method Pattern

```typescript
// treatment.service.ts
public async save(changeset: ImmerChangeset<ValidatedTreatment>) {
  if (changeset.data.id) {
    return this.update(changeset.data as UpdateTreatmentData, changeset);
  } else {
    return this.create(changeset.data as CreateTreatmentData, changeset);
  }
}
```

### Store Interaction

```typescript
// Create
const record = this.store.createRecord<Treatment>('treatments', data);
const request = createRecord(record);
await this.store.request(request);

// Update
const existing = this.store.peekRecord<Treatment>({ id: data.id, type: 'treatments' });
const request = updateRecord(existing, { patch: true });
await this.store.request(request);
```

---

## 6. No Direct Feature References

### What Doesn't Exist

- ❌ No existing treatment management code
- ❌ No existing multi-step wizard pattern
- ❌ No existing searchable tag input component
- ❌ No existing modal for precisions/sub-purposes

### What Needs to Be Built

**Wizard Navigation Component** — New component to:
- Track current step (1-8)
- Render progress indicator
- Manage navigation buttons (previous, next, skip, save, finish)
- Validate step before allowing navigation
- Handle draft persistence

**Searchable Tag Input** — Reusable component for:
- Search input with autocomplete
- Tag display with remove (X) button
- Info icon (Ⓘ) for additional details
- Used in steps 3, 4, 6, 7, 8

**Modal Dialogs** — Reusable components for:
- Sub-purposes modal (step 3)
- Precisions modal (steps 4, 5, 7, 8)
- Data access details modal (step 7)

**Retention Period Selector** — Component for:
- Duration input + unit selector
- Used in step 5 for data retention periods

---

## 7. Testing Patterns

### Component Testing

**Reference**: `@libs/users-front/src/components/forms/user-form.test.ts`

**Pattern**:
```typescript
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TestApp, initializeTestApp } from '../app.ts';

describe('UserForm', function() {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('renders form fields', async function({ context }) {
    await initializeTestApp(context.owner, 'en-us');
    const changeset = new UserChangeset({});

    await render(<template><UserForm @changeset={{changeset}} /></template>);

    // Assertions...
  });
});
```

### MSW Mocking

**Reference**: `@libs/users-front/http-mocks/`

**Pattern**: Separate file per endpoint

```typescript
// http-mocks/create-treatment.ts
import { http, HttpResponse } from 'msw';

export default http.post('/api/v1/treatments', async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({
    data: {
      id: '123',
      type: 'treatments',
      attributes: body.data.attributes,
    },
  });
});
```

```typescript
// http-mocks/all.ts
import createTreatment from './create-treatment';
import getTreatments from './get-treatments';
import updateTreatment from './update-treatment';

export default [createTreatment, getTreatments, updateTreatment];
```

---

## Summary

When implementing the treatment wizard:

1. **Follow the established frontend lib structure** from users-front and todos-front
2. **Use the same integration points** in @apps/front (router, application route, store, translations)
3. **Apply the form pattern** but adapt for multi-step wizard navigation
4. **Build new reusable components** for wizard-specific UI patterns (searchable tags, modals, progress indicator)
5. **Use SQLite WASM for storage** (no backend needed in Phase 1B)
6. **Test with MSW mocks** and component rendering tests

All patterns are proven and working in the existing codebase. The wizard is a new feature, but it follows the same architectural principles.
