# Frontend Library Integration

How to integrate a frontend library into the main app (`@apps/front`).

## 1. Initialize Library

In `app/routes/application.ts`:

```typescript
import { initialize as initializeTodoLib } from '@libs/todos-front';

async beforeModel() {
  await initializeTodoLib(getOwner(this)!);
}
```

- Import `initialize` function from library
- Call in `beforeModel()` hook
- Use `getOwner(this)!` to get owner
- Can be async if library initialization is async

## 2. Register Routes

In `app/router.ts`:

```typescript
import { forRouter as todosLibRouter } from '@libs/todos-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    todosLibRouter.call(this);
  });
});
```

- Import `forRouter` function (rename if multiple libs)
- Call with `.call(this)` inside route definition
- Nest under appropriate parent route (e.g., `dashboard`)

For multiple router functions:

```typescript
import { forRouter as userLibRouter, authRoutes } from '@libs/users-front';

Router.map(function () {
  this.route('dashboard', function () {
    userLibRouter.call(this);
  });
  authRoutes.call(this);
});
```

## 3. Add Schemas to Store

In `app/services/store.ts`:

```typescript
import TodoSchema from '@libs/todos-front/schemas/todos';

const legacyStore = useLegacyStore({
  schemas: [UserSchema, TodoSchema],
});
```

- Import schema from library
- Add to `schemas` array in `useLegacyStore` config

## 4. Add MSW Handlers

In `app/routes/application.ts`:

```typescript
import allTodosHandlers from '@libs/todos-front/http-mocks/all';

if (import.meta.env.VITE_MOCK_API !== 'false') {
  const worker = setupWorker(...allUsersHandlers, ...allTodosHandlers);
  await worker.start({ onUnhandledRequest: 'bypass' });
}
```

- Import `all` handlers from library's `http-mocks/all`
- Spread into `setupWorker()` call
- Only when `VITE_MOCK_API !== 'false'`

## 5. Import Styles

In `app/styles/app.css`:

```css
@source "../../node_modules/@libs/todos-front";
```

- Add `@source` directive for each library
- Path is relative to `app/styles/` directory

## 6. Add to package.json

In `@apps/front/package.json`:

```json
{
  "devDependencies": {
    "@libs/todos-front": "workspace:^"
  }
}
```

- Add library to `devDependencies` (not `dependencies`)
- Use `workspace:^` for monorepo packages
