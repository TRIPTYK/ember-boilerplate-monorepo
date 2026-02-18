# Standards for Phase 1B: Core Treatment Management

The following standards apply to the implementation of steps 1-2 of the treatment wizard. The same standards will also apply when implementing steps 3-8 in future releases.

Full content included for easy reference.

---

## frontend/form-pattern

Forms use Zod validation + ImmerChangeset + TpkForm + entity service.

### File structure

```
src/components/forms/
├── {entity}-form.gts          # Form component
└── {entity}-validation.ts     # Zod validation schema
```

### Validation schema

Factory function taking `IntlService` for i18n error messages:

```typescript
// {entity}-validation.ts
import { boolean, object, string } from 'zod';
import type { IntlService } from 'ember-intl';

export const create{Entity}ValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('{entities}.forms.{entity}.validation.titleRequired'))
      .min(1, intl.t('{entities}.forms.{entity}.validation.titleRequired')),
    id: string().optional().nullable(),
  });

export type Validated{Entity} = z.infer<ReturnType<typeof create{Entity}ValidationSchema>>;
export type Update{Entity}Data = Validated{Entity} & { id: string };
```

### Form component

```typescript
// {entity}-form.gts
interface {Entity}FormArgs {
  changeset: {Entity}Changeset;
}

export default class {Entity}Form extends Component<{Entity}FormArgs> {
  @service declare {entity}: {Entity}Service;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  get validationSchema() {
    return create{Entity}ValidationSchema(this.intl);
  }

  onSubmit = async (data, changeset) => {
    await this.{entity}.save(changeset);
    await this.router.transitionTo('dashboard.{entities}');
    this.flashMessages.success(this.intl.t('{entities}.forms.{entity}.messages.saveSuccess'));
  };

  <template>
    <TpkForm @changeset={{@changeset}} @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}} data-test-{entities}-form as |F|>
      <F.TpkInputPrefab @label={{t "{entities}.forms.{entity}.labels.title"}} @validationField="title" />
      <button type="submit">{{t "{entities}.forms.{entity}.actions.submit"}}</button>
    </TpkForm>
  </template>
}
```

### Key rules

- Validation schema is a factory function — it needs `IntlService`
- All labels and error messages use i18n keys via `t` helper
- `onSubmit` flow: save via service → transition → flash message
- Changeset is passed in from the route template, not created in the form
- Add `data-test-{entities}-form` attribute on `TpkForm` for testing

---

## frontend/schema-changeset

### WarpDrive Schema

`src/schemas/{entities}.ts` — defines the data shape for the store:

```typescript
import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const {Entity}Schema = withDefaults({
  type: '{entities}',
  fields: [
    { name: 'title', kind: 'attribute' },
    { name: 'description', kind: 'attribute' },
    { name: 'completed', kind: 'attribute' },
  ],
});

export default {Entity}Schema;

export type {Entity} = WithLegacy<{
  title: string;
  description: string;
  completed: boolean;
  [Type]: '{entities}';
}>;
```

- Schema `type` matches the API resource type (plural)
- Export both the schema (default) and the type (named)
- Uses `@warp-drive/legacy` API intentionally

### Changeset

`src/changesets/{entity}.ts` — immutable form state wrapper:

```typescript
import ImmerChangeset from 'ember-immer-changeset';

export interface Draft{Entity} {
  id?: string | null;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class {Entity}Changeset extends ImmerChangeset<Draft{Entity}> {}
```

- All fields are optional (form may be partially filled)
- `id` is `string | null | undefined` — null for new records

---

## frontend/service-crud

Each entity gets a service in `src/services/{entity}.ts` for CRUD operations via WarpDrive.

### Structure

```typescript
import Service, { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

export default class {Entity}Service extends Service {
  @service declare store: Store;

  public async save(changeset: ImmerChangeset<Validated{Entity}>) {
    if (changeset.data.id) {
      return this.update(changeset.data as Update{Entity}Data, changeset);
    } else {
      return this.create(changeset.data as Create{Entity}Data, changeset);
    }
  }

  public async create(data: Create{Entity}Data, changeset?: ImmerChangeset<Validated{Entity}>) {
    const record = this.store.createRecord<{Entity}>('{entities}', data);
    const request = createRecord(record);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(record)),
    });
    await this.store.request(request);
  }

  public async update(data: Update{Entity}Data, changeset?: ImmerChangeset<Validated{Entity}>) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be updated', existing);
    const request = updateRecord(existing, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    await this.store.request(request);
  }

  public async delete(data: Update{Entity}Data) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be deleted', existing);
    const request = deleteRecord(existing);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
```

### Key rules

- `save()` dispatches to create/update based on `changeset.data.id`
- Use `peekRecord` for update/delete (record must already be in store)
- Use `createRecord` for new records
- Always `assert` that records exist before update/delete
- `request.body` manual assignment is a workaround — may change in future WarpDrive versions

---

## frontend/route-template

Routes and templates are separate files by design for separation of concerns.

### File location

`src/routes/dashboard/{entities}/`:

```
├── index.gts              # Route handler (list)
├── index-template.gts     # Template (list view)
├── create.gts             # Route handler (create)
├── create-template.gts    # Template (create form)
├── edit.gts               # Route handler (edit)
└── edit-template.gts      # Template (edit form)
```

### Naming rule

Template file = route file name + `-template.gts`

### Route handler patterns

**Simple route** (no data loading):
```typescript
export type TodosCreateRouteSignature = {
  model: Awaited<ReturnType<TodosCreateRoute['model']>>;
  controller: undefined;
};

export default class TodosCreateRoute extends Route {}
```

**Route with model loading**:
```typescript
export type TodosEditRouteSignature = {
  model: Awaited<ReturnType<TodosEditRoute['model']>>;
  controller: undefined;
};

export default class TodosEditRoute extends Route {
  @service declare store: Store;

  async model({ todo_id }: { todo_id: string }) {
    const todo = await this.store.request(
      findRecord<Todo>('todos', todo_id, { include: [] })
    );
    assert('Todo must not be null', todo.content.data !== null);
    return { todo: todo.content.data };
  }
}
```

### Template patterns

**Template-only** (list/index):
```typescript
export default <template>
  <TodosTable />
</template> as TOC<{
  model: Awaited<ReturnType<TodosIndexRoute['model']>>;
  controller: undefined;
}>;
```

**Class template** (create/edit — needs changeset):
```typescript
export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  changeset = new TodoChangeset({});
  <template><TodosForm @changeset={{this.changeset}} /></template>
}
```

### Key rules

- Always export route signature type from the route file
- Dynamic segments: `:{entity}_id` naming
- Edit templates initialize changeset from `this.args.model`
- Create templates initialize changeset with empty `{}`

---

## frontend/translations

Libs export translation keys. Apps provide the actual translations.

### Rule

- Libs **never** contain translation files
- Apps store translations in `@apps/front/app/translations/{entities}/{locale}.yaml`

### Key naming convention

`{entities}.{context}.{subcontext}.{key}`

Examples:
```
todos.forms.todo.labels.title
todos.forms.todo.labels.description
todos.forms.todo.validation.titleRequired
todos.forms.todo.messages.saveSuccess
todos.forms.todo.messages.deleteSuccess
todos.forms.todo.actions.submit
todos.forms.todo.actions.back
todos.table.headers.title
todos.table.headers.description
todos.table.actions.edit
todos.table.actions.delete
todos.table.actions.addTodo
todos.table.confirmModal.question
todos.pages.list.title
```

### File location

```
@apps/front/app/translations/
├── todos/
│   ├── en-us.yaml
│   └── fr-fr.yaml
├── users/
│   ├── en-us.yaml
│   └── fr-fr.yaml
└── global keys in root translations
```

### Usage in components

```typescript
// Template helper
{{t "todos.forms.todo.labels.title"}}

// Service injection
this.intl.t('todos.forms.todo.messages.saveSuccess')
```

---

## frontend/file-extensions

Use .gts for template-containing files, .ts for logic-only.

**Component files (.gts):**
```typescript
// login-form.gts
import Component from '@glimmer/component';

export default class LoginForm extends Component {
  <template>
    <form>...</form>
  </template>
}
```

**Template-only (.gts):**
```typescript
// index-template.gts
import type { TOC } from '@ember/component/template-only';

export default <template>
  <h1>Users</h1>
</template> as TOC<object>;
```

**Logic-only (.ts):**
```typescript
// user.service.ts
import Service from '@ember/service';

export default class UserService extends Service {
  // No template
}
```

**Rules:**
- .gts when file contains `<template>` tags
- .ts for services, routes, utilities, schemas
- .gts combines TypeScript + Handlebars in one file

**Why:** .gts enables type-safe templates with Glint. Clear distinction between template and logic files.

---

## frontend/app-integration

Steps to wire a new frontend lib into `@apps/front`:

### 1. Add dependency

`@apps/front/package.json`:
```json
"devDependencies": {
  "@libs/{name}-front": "workspace:^"
}
```
Then run `pnpm install`.

### 2. Initialize lib

`@apps/front/app/routes/application.ts`:
```typescript
import { initialize as initialize{Name}Lib } from '@libs/{name}-front';
import { getOwner } from '@ember/-internals/owner';

// In beforeModel():
await initialize{Name}Lib(getOwner(this)!);
// or without await if initialize is sync
```

### 3. Register mock handlers

Same file, `routes/application.ts`:
```typescript
import all{Name}Handlers from '@libs/{name}-front/http-mocks/all';

// In beforeModel(), add to setupWorker:
const worker = setupWorker(...allUsersHandlers, ...all{Name}Handlers);
```

### 4. Register routes

`@apps/front/app/router.ts`:
```typescript
import { forRouter as {name}LibRouter } from '@libs/{name}-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    {name}LibRouter.call(this);
  });
});
```

### 5. Register schema in store

`@apps/front/app/services/store.ts`:
```typescript
import {Entity}Schema from '@libs/{name}-front/schemas/{entities}';

// Add to useLegacyStore schemas array:
schemas: [UserSchema, {Entity}Schema],
```

### 6. Add CSS source

`@apps/front/app/styles/app.css`:
```css
@source "../../node_modules/@libs/{name}-front";
```

### 7. Add translations

Create translation files in:
```
@apps/front/app/translations/{entities}/en-us.yaml
@apps/front/app/translations/{entities}/fr-fr.yaml
```

---

## testing/rendering-tests

Use scoped renderingTest with TestApp for all component tests.

### Test Structure

```typescript
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TestApp, initializeTestApp } from '../app.ts';
import MyComponent from '#src/components/my-component.gts';

describe('MyComponent', function() {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('renders correctly', async function({ context }) {
    await initializeTestApp(context.owner, 'en-us');

    await render(<template><MyComponent /></template>);

    // assertions...
  });
});
```

### What initializeTestApp Does

```typescript
export async function initializeTestApp(owner: Owner, locale: string) {
  owner.register('session-stores:application', AdaptiveStore);
  owner.register('service:store', TestStore);
  const intl = owner.lookup('service:intl');
  intl.setLocale(locale);
  setupSession(owner);
  // Boot required services...
}
```

It registers test-specific implementations for session, store, and intl services.

### Accessing Services in Tests

```typescript
renderingTest('test case', async function({ context }) {
  await initializeTestApp(context.owner, 'en-us');

  const session = context.owner.lookup('service:session');
  // Use session for test setup...
});
```

**Rules:**
- Always use `renderingTest.scoped` with TestApp
- Call `initializeTestApp` before any rendering
- Pass locale (usually 'en-us')
- Access services via `context.owner.lookup()`

**Why:** Normal app doesn't work in tests. TestApp provides isolated test environment with proper DI container.

---

## testing/msw-mocking

Use openapi-msw for type-safe API mocking.

**Shared mocks (http-mocks/ folder):**
```typescript
import { createOpenApiHttp } from 'openapi-msw';
import type { paths } from 'backend-app';

const http = createOpenApiHttp<paths>();

export default [
  http.untyped.get('/api/v1/users/:id', (req) => {
    return HttpResponse.json({ data: mockUser });
  }),
];
```

**Inline mocks (unit/integration tests):**
```typescript
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('/users', () => HttpResponse.json({ data: { id: '123' } })),
];

beforeAll(async () => {
  const worker = setupWorker(...handlers);
  await worker.start();
  return () => worker.stop();
});
```

**Rules:**
- Use createOpenApiHttp when backend types available
- Use http.untyped for flexibility
- Shared mocks in http-mocks/ for acceptance/development
- Inline mocks for unit/integration tests

**Why:** Type-safe mocks catch API contract changes. Shared mocks enable development mode without backend.
