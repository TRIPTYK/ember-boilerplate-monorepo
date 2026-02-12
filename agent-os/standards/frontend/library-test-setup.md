# Frontend Library Test Setup

Test infrastructure in `tests/app.ts` for frontend libraries.

## Required Exports

### `TestApp` Class

Extends `Application` and defines modules for testing.

```typescript
export class TestApp extends Application {
  podModulePrefix = '';
  modules = {
    './router': Router,
    './services/intl': { default: IntlService },
    './services/page-title': { default: PageTitleService },
    './services/flash-message': { default: FlashMessageService },
    ...moduleRegistry(),
    ...inputValidationRegistry(),
    ...compatModules,
  };
}
```

- Always include `Router` class
- Include required services: `intl`, `page-title`, `flash-message`
- Merge `moduleRegistry()` from library
- Merge external registries (e.g., `inputValidationRegistry()`)
- Include `compatModules` for Embroider compatibility

### `TestStore` Class

Extends `useLegacyStore` with library schemas.

```typescript
export default class TestStore extends useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: true,
  cache: JSONAPICache,
  schemas: [TodoSchema],
}) {}
```

- Always use `JSONAPICache`
- Include library schemas in `schemas` array
- Set `linksMode: false`, `legacyRequests: true`, `modelFragments: true`

### `initializeTestApp(owner: Owner, locale: string)`

Sets up test environment and initializes library.

```typescript
export async function initializeTestApp(owner: Owner, locale: string) {
  owner.register('service:store', TestStore);
  owner.register('service:flash-messages', FlashMessageService);
  owner.register('config:environment', { flashMessageDefaults: {} });
  const router = owner.lookup('router:main') as Router;
  router.setupRouter();
  const intl = owner.lookup('service:intl');
  intl.setLocale(locale);
  intl.setOnMissingTranslation((key) => `t:${key}`);
  setupSession(owner);
  await initialize(owner);
}
```

- Register `TestStore` as `service:store`
- Register `FlashMessageService` and config
- Setup router with `router.setupRouter()`
- Configure Intl with locale and missing translation handler
- Call `setupSession(owner)` if using ember-simple-auth
- Call library's `initialize(owner)` function

## Router Class

Define a minimal router for tests:

```typescript
class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

Router.map(function () {
  this.route('dashboard', function () {
    forRouter.call(this);
  });
});
```

- Use `location = 'none'` for tests
- Include library routes via `forRouter.call(this)`
- Include optional routes (e.g., `authRoutes.call(this)`) if needed
