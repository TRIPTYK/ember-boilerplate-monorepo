# Frontend Library Core Exports

Required exports from `src/index.ts` for frontend libraries.

## Required Exports

### `initialize(owner: Owner)`

Initializes the library. Validates required services are available.

```typescript
export function initialize(owner: Owner) {
  const intlService = owner.lookup('service:intl') as IntlService | undefined;
  assert('Intl service must be available', intlService);
}
```

- Use `assert()` to validate required services
- Can be async if initialization requires async operations
- Called from main app's `application` route `beforeModel()`

### `moduleRegistry()`

Returns Ember module registry using `buildRegistry` and glob imports.

```typescript
export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    './services/intl': {
      default: IntlService,
    },
  })();
}
```

- Always include globs for routes, templates, helpers, components, services
- Add explicit service registrations for external services (e.g., `IntlService`, `SessionService`)
- Used by `TestApp` in `tests/app.ts`

### `forRouter(this: DSL)`

Defines routes for the library.

```typescript
export function forRouter(this: DSL) {
  this.route('todos', function () {
    this.route('create');
    this.route('edit', { path: '/:todo_id/edit' });
  });
}
```

- Use `this.route()` to define nested routes
- Use `path` option for custom paths (e.g., `/:id/edit`)
- Called from main app's `router.ts` with `.call(this)`

## Optional Exports

### Additional Router Functions

Libraries can export multiple router functions for different route groups:

```typescript
export function authRoutes(this: DSL) {
  this.route('login');
  this.route('forgot-password');
}
```

- Import and call separately in main app router
- Useful for separating feature routes from auth routes
