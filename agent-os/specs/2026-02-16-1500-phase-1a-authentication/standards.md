# Standards for Phase 1A Authentication System

The following standards from `agent-os/standards/` apply to this work and must be followed during implementation.

---

## Backend Standards

### entity-definitions

Use MikroORM's functional `defineEntity` API (not decorators).

**Pattern:**
```ts
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TodoEntity = defineEntity({
  name: "Todo",
  properties: {
    id: p.string().primary(),
    title: p.string(),
    completed: p.boolean().default(false),
    userId: p.string().index(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type TodoEntityType = InferEntity<typeof TodoEntity>;
```

**Rules:**
- Always export both the entity (`TodoEntity`) and its inferred type (`TodoEntityType`)
- Use `p.string()`, `p.boolean()`, `p.date()` etc. with chained modifiers: `.primary()`, `.nullable()`, `.index()`, `.default()`, `.onCreate()`
- Use `tableName` when the table name differs from the entity name (e.g., `refresh_tokens`)
- **Store dates as ISO strings** (`p.string()` + `.onCreate(() => new Date().toISOString())`), not Date objects — keeps the format consistent across DB, API, and frontend

**Updates:**
Use `wrap(entity).assign()` for partial updates, then `em.flush()`:
```ts
wrap(todo).assign(body.data.attributes);
await repository.getEntityManager().flush();
```

**File naming:** `{entity}.entity.ts` (e.g., `user.entity.ts`, `todo.entity.ts`)

---

### route-structure

Routes are class-based for dependency injection and consistency across all modules.

**Pattern:**
Each route:
- Implements `Route<FastifyInstanceType>` from `@libs/backend-shared`
- Receives dependencies (repositories, EntityManager) via constructor
- Exposes a single `routeDefinition(f)` method

```ts
export class CreateRoute implements Route<FastifyInstanceType> {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceType) {
    return f.post(
      "/",
      {
        schema: {
          body: makeSingleJsonApiTopDocument(/* input schema */),
          response: { 200: makeSingleJsonApiTopDocument(SerializedTodoSchema) },
        },
      },
      async (request, reply) => { /* handler */ },
    );
  }
}
```

**Registration:**
Routes are collected in an array and registered in the module's `setupRoutes()`:
```ts
const routes: Route<FastifyInstanceType>[] = [
  new CreateRoute(repository),
  new ListRoute(em),
  new GetRoute(repository),
  new UpdateRoute(repository),
  new DeleteRoute(repository),
];

for (const route of routes) {
  route.routeDefinition(f);
}
```

**File naming:** One file per route: `{action}.route.ts` (e.g., `create.route.ts`, `login.route.ts`)

**Common mistake:** Always use JSON:API schema wrappers (`makeSingleJsonApiTopDocument`, `makeJsonApiDocumentSchema`) for `body` and `response` schemas — don't pass raw Zod objects.

---

### jwt-authentication

Use JWT Bearer tokens for API authentication.

**Token Generation:**
```typescript
import { generateTokens } from "#src/utils/jwt.utils.js";

const { accessToken, refreshToken } = generateTokens(
  { userId: user.id, email: user.email },
  jwtSecret,
  jwtRefreshSecret
);
```

**Token expiry:**
- Access token: 15 minutes
- Refresh token: 7 days (stored as SHA-256 hash, supports rotation and theft detection)

**Payload structure:**
```typescript
interface JwtPayload {
  userId: string;
  email: string;
}
```

**Token Verification Middleware:**
```typescript
// Create middleware with dependencies
const jwtAuthMiddleware = createJwtAuthMiddleware(em, jwtSecret);

// Apply to protected routes via preValidation hook
f.addHook("preValidation", jwtAuthMiddleware);
```

The middleware:
1. Extracts Bearer token from `Authorization` header
2. Verifies token and decodes payload
3. Loads user from database
4. Attaches user to `request.user`

**Rules:**
- Always return both accessToken and refreshToken from login
- Store tokens client-side via ember-simple-auth session
- Re-login required when access token expires
- Use `JWT_SECRET` and `JWT_REFRESH_SECRET` env vars (must be different)
- Return 401 with `UNAUTHORIZED` code on auth failure

**Why:** Stateless authentication without server-side session storage.

---

### password-hashing

Use Argon2 for all password hashing.

```typescript
import { hash, verify } from "argon2";

// Hash password before storing
const hashedPassword = await hash(plainPassword);

// Verify password on login
const isValid = await verify(storedHash, plainPassword);
```

**Utility functions:** Use `#src/utils/auth.utils.js`:
- `hashPassword(password)` — returns hashed string
- `verifyPassword(hash, password)` — returns boolean

**Rules:**
- Never store plain text passwords
- Always use the utility functions, not argon2 directly
- Use default Argon2 settings (secure by default)

**Why:** Argon2 is the recommended password hashing algorithm (PHC winner), more secure than bcrypt.

---

### json-api-serialization

Manual serializer functions paired with Zod schemas — gives full control over exposed fields and type-safe responses.

**Schema definition:**
Use helpers from `@libs/backend-shared`:
```ts
import { makeJsonApiDocumentSchema, makeSingleJsonApiTopDocument } from "@libs/backend-shared";

export const SerializedUserSchema = makeJsonApiDocumentSchema(
  "users",
  object({
    email: email(),
    firstName: string(),
    lastName: string(),
    // Never include password
  }),
);
```

**Serializer functions:**
Three functions per entity:
```ts
// Single resource
export function jsonApiSerializeUser(user: UserEntityType) {
  return {
    id: user.id,
    type: "users" as const,
    attributes: { email: user.email, firstName: user.firstName, lastName: user.lastName },
  };
}

// Single document wrapper
export function jsonApiSerializeSingleUserDocument(user: UserEntityType) {
  return { data: jsonApiSerializeUser(user) };
}

// Collection document wrapper
export function jsonApiSerializeManyUsersDocument(users: UserEntityType[]) {
  return { data: users.map(jsonApiSerializeUser) };
}
```

**Rules:**
- **Never expose sensitive fields** (passwords, token hashes) in serialized output
- Use `as const` on the `type` field for literal type inference
- Type must match resource name (plural): `"users"`, `"todos"`
- Schema is used for both serialization AND Fastify response validation
- Collections may include `meta: { total }` for pagination

**File naming:** `{entity}.serializer.ts` (e.g., `user.serializer.ts`, `todo.serializer.ts`)

---

### app-wiring

Steps to register a new module in @apps/backend: entities, init, router, seeder.

1. Create module in `@libs/{feature}-backend`
2. Export entities in barrel file (`index.ts`)
3. Create `init.ts` with `Module` class implementing `ModuleInterface`
4. Register in `@apps/backend/src/app/app.router.ts`
5. Add entities to `@apps/backend/src/mikro-orm.config.ts`
6. Create seeder if needed

---

### module-system

Class-based module pattern with static `init()`, forked EntityManager, and `setupRoutes()`.

```typescript
export class Module implements ModuleInterface<FastifyInstanceType> {
  public static init(context: LibraryContext): Module {
    return new Module(context.em.fork(), context.configuration);
  }

  private constructor(
    private em: EntityManager,
    private configuration: Configuration
  ) {}

  public async setupRoutes(fastify: FastifyInstanceType): Promise<void> {
    // Register routes
  }
}
```

---

### error-format

JSON:API error format via `makeJsonApiError` and `handleJsonApiErrors`.

```typescript
return reply.status(404).send(
  makeJsonApiError('NOT_FOUND', 'Resource not found')
);
```

---

## Frontend Standards

### form-pattern

Forms use Zod validation + ImmerChangeset + TpkForm + entity service.

**File structure:**
```
src/components/forms/
├── {entity}-form.gts          # Form component
└── {entity}-validation.ts     # Zod validation schema
```

**Validation schema:**
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

**Form component:**
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

**Key rules:**
- Validation schema is a factory function — it needs `IntlService`
- All labels and error messages use i18n keys via `t` helper
- `onSubmit` flow: save via service → transition → flash message
- Changeset is passed in from the route template, not created in the form
- Add `data-test-{entities}-form` attribute on `TpkForm` for testing

---

### route-template

Routes and templates are separate files by design for separation of concerns.

**File location:** `src/routes/dashboard/{entities}/`

```
├── index.gts              # Route handler (list)
├── index-template.gts     # Template (list view)
├── create.gts             # Route handler (create)
├── create-template.gts    # Template (create form)
├── edit.gts               # Route handler (edit)
└── edit-template.gts      # Template (edit form)
```

**Naming rule:** Template file = route file name + `-template.gts`

**Route handler patterns:**

Simple route (no data loading):
```typescript
export type TodosCreateRouteSignature = {
  model: Awaited<ReturnType<TodosCreateRoute['model']>>;
  controller: undefined;
};

export default class TodosCreateRoute extends Route {}
```

Route with model loading:
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

**Template patterns:**

Template-only (list/index):
```typescript
export default <template>
  <TodosTable />
</template> as TOC<{
  model: Awaited<ReturnType<TodosIndexRoute['model']>>;
  controller: undefined;
}>;
```

Class template (create/edit — needs changeset):
```typescript
export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  changeset = new TodoChangeset({});
  <template><TodosForm @changeset={{this.changeset}} /></template>
}
```

**Key rules:**
- Always export route signature type from the route file
- Dynamic segments: `:{entity}_id` naming
- Edit templates initialize changeset from `this.args.model`
- Create templates initialize changeset with empty `{}`

---

### http-mocks

Each lib provides MSW mock handlers in `src/http-mocks/`.

**File structure:**
```
src/http-mocks/
├── {entities}.ts    # CRUD mock handlers for entity
└── all.ts           # Aggregates all handlers
```

**Handler file:**
Use `openapi-msw` with typed handlers when the backend types are available:
```typescript
import { HttpResponse } from 'msw';
import type { paths } from '@apps/backend';
import { createOpenApiHttp } from 'openapi-msw';

const mockData = [
  { id: '1', type: '{entities}' as const, attributes: { title: '...', description: '...' } },
];

const http = createOpenApiHttp<paths>();

export default [
  http.get('/api/v1/{entities}/{id}', (req) => {
    const { id } = req.params;
    const item = mockData.find((d) => d.id === id);
    return item
      ? HttpResponse.json({ data: item })
      : HttpResponse.json({ message: 'Not Found', code: '{ENTITY}_NOT_FOUND' }, { status: 404 });
  }),

  // Use http.untyped.* when typed handler doesn't match (e.g., list with filters)
  http.untyped.get('/api/v1/{entities}', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('filter[search]');
    const sort = url.searchParams.get('sort');
    // ... filter and sort logic
    return HttpResponse.json({ data: results, meta: { total: results.length } });
  }),

  http.post('/api/v1/{entities}/', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;
    return HttpResponse.json({
      data: { id: json.data.lid, type: '{entities}' as const, attributes: json.data.attributes },
    });
  }),

  http.patch('/api/v1/{entities}/{id}', async (req) => { /* same pattern */ }),
  http.delete('/api/v1/{entities}/{id}', (req) => { /* return success message */ }),
];
```

**Aggregator file:** `all.ts` — combines all handler arrays:
```typescript
import {entities} from './{entities}.ts';
import login from './login.ts';

export default [...login, ...{entities}];
```

**Key rules:**
- Prefer typed `http.get/post/patch/delete` from `createOpenApiHttp<paths>()` when backend types exist
- Fall back to `http.untyped.*` when typed handlers don't match (e.g., list with query params)
- Mock data uses JSON:API format: `{ id, type, attributes }`
- Response envelope: `{ data }` for success, `{ message, code }` for errors
- Every lib must have an `all.ts` that exports all handlers

---

### translations

Libs export translation keys. Apps provide the actual translations.

**Rule:**
- Libs **never** contain translation files
- Apps store translations in `@apps/front/app/translations/{entities}/{locale}.yaml`

**Key naming convention:** `{entities}.{context}.{subcontext}.{key}`

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

**File location:**
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

**Usage in components:**
```typescript
// Template helper
{{t "todos.forms.todo.labels.title"}}

// Service injection
this.intl.t('todos.forms.todo.messages.saveSuccess')
```

---

## Global Standards

### feature-libraries

Features are split into paired frontend and backend libraries.

**Naming:**
- `@libs/[feature]-front` — Ember addon (components, routes, services)
- `@libs/[feature]-backend` — Fastify module (routes, entities, serializers)

**Backend module structure:**
```typescript
// @libs/users-backend/src/init.ts
export class Module implements ModuleInterface {
  public static init(context: LibraryContext): Module { ... }
  public async setupRoutes(fastify): Promise<void> { ... }
}
```

**Registration in @apps/backend:**
```typescript
const UserModule = Module.init({ em, configuration });
await app.setupRoutes([UserModule]);
```

**Frontend addon:** Standard Ember v2 addon with components, routes, services exported via `ember-addon.app-js`.

**Rules:**
- Feature names must match: `users-front` pairs with `users-backend`
- Backend modules are self-contained (own entities, routes, serializers)
- Frontend addons follow Ember v2 addon conventions

**Why:** Paired libraries keep feature code together while separating frontend/backend concerns.

---

### import-alias

Use `#src/` import alias instead of relative paths.

**Good:** `import { hashPassword } from "#src/utils/auth.utils.js";`
**Bad:** `import { hashPassword } from "../../utils/auth.utils.js";`

---

### post-implementation-checks

Run lint globally and tests on modified packages after implementation.

```bash
pnpm lint              # Run oxlint globally
pnpm test              # Run tests on all packages
pnpm -F @libs/users-backend test  # Run tests on specific package
```

---

*These standards ensure consistency, maintainability, and type safety across the codebase.*
