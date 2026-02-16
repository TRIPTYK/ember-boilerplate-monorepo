# Index.ts Entry Point

Every frontend lib must export these functions from `src/index.ts`:

## `moduleRegistry()`

Registers the lib's modules into Ember's resolver. Only include glob patterns for folders that exist:

```typescript
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import IntlService from 'ember-intl/services/intl';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    './services/intl': { default: IntlService },
  })();
}
```

- Always include the manual `IntlService` entry
- Add other manual service entries as needed (e.g., `SessionService` for auth libs)

## `initialize(owner: Owner)`

Asserts required services exist. Can be `async` if setup requires awaiting:

```typescript
export function initialize(owner: Owner) {
  const intlService = owner.lookup('service:intl') as IntlService | undefined;
  const storeService = owner.lookup('service:store') as Store | undefined;
  assert('Intl service must be available', intlService);
  assert('Store service must be available', storeService);
}
```

## `forRouter(this: DSL)`

Defines the lib's routes. Called inside the parent route (usually `dashboard`) in the app's router:

```typescript
export function forRouter(this: DSL) {
  this.route('{entities}', function () {
    this.route('create');
    this.route('edit', { path: '/:{entity}_id/edit' });
  });
}
```

- Dynamic segments: `:{entity}_id` naming (e.g., `:todo_id`, `:user_id`)
- Export additional router functions for routes at different nesting levels (e.g., `authRoutes` for top-level routes)
