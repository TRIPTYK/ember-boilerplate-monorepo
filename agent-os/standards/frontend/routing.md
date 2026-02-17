# Routing

Define routes in feature libraries and inject them into the main router. Protect routes with ember-simple-auth guards in `beforeModel`.

## Router definition

The main app router calls route-map functions exported by feature libraries using `.call(this)`.

```typescript
// @apps/front/app/router.ts
import { forRouter as userLibRouter, authRoutes } from '@libs/users-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    userLibRouter.call(this);   // nested under dashboard (protected)
  });
  authRoutes.call(this);        // top-level (public)
});
```

## Route-map functions in feature libraries

Export two functions per feature library: one for authenticated routes (nested under `dashboard`), one for public routes (top-level).

```typescript
// @libs/users-front/src/index.ts
import type DSL from '@ember/routing/-private/dsl';

export function forRouter(this: DSL) {
  this.route('users', function () {
    this.route('create');
    this.route('edit', { path: '/:user_id/edit' });
  });
}

export function authRoutes(this: DSL) {
  this.route('login');
  this.route('forgot-password');
  this.route('logout');
}
```

The library also registers its route classes and templates into the Ember container via `moduleRegistry()` using `ember-strict-application-resolver` with `import.meta.glob('./routes/**/*.{js,ts}', { eager: true })`.

## Auth guards

Use `ember-simple-auth` session methods in `beforeModel` to protect routes.

**Require authentication** — place on a parent route to protect all children:

```typescript
// routes/dashboard.ts
export default class DashboardRoute extends Route {
  @service declare session: SessionService;

  beforeModel(t: Transition) {
    this.session.requireAuthentication(t, 'login');
  }
}
```

All routes nested under `dashboard` inherit this guard. Unauthenticated users are redirected to `login`.

**Prohibit authentication** — prevent authenticated users from accessing public-only routes:

```typescript
// routes/login.gts
export default class LoginRoute extends Route {
  @service declare session: SessionService;

  beforeModel() {
    this.session.prohibitAuthentication('application');
  }
}
```

Authenticated users visiting `/login` are redirected to the `application` route.

## Route hooks

| Hook | Use for | Example |
|---|---|---|
| `beforeModel` | Auth guards, session invalidation, app initialization | `requireAuthentication`, `session.invalidate()` |
| `model` | Loading data via WarpDrive `store.request()` | `findRecord<User>('users', id)` |

`afterModel` is not used. Keep routes thin — delegate data loading to `model()` and business logic to services.

```typescript
// routes/dashboard/users/edit.gts
export default class UsersEditRoute extends Route {
  @service declare store: Store;

  async model({ user_id }: { user_id: string }) {
    const response = await this.store.request(
      findRecord<User>('users', user_id, { include: [] })
    );
    assert('User must not be null', response.content.data !== null);
    return { user: response.content.data };
  }
}
```

Routes that don't load data can be empty classes:

```typescript
export default class UsersIndexRoute extends Route {}
```

## Route type signatures

Export a signature type from the route file so templates can type-check `@model`.

```typescript
// routes/dashboard/users/create.gts
export type UsersCreateRouteSignature = {
  model: Awaited<ReturnType<UsersCreateRoute['model']>>;
  controller: undefined;
};

export default class UsersCreateRoute extends Route {}
```

## Navigation

Use `<LinkTo>` for declarative links in templates and `router.transitionTo()` for programmatic navigation in component/service logic.

```handlebars
{{! Template — declarative }}
<LinkTo @route="dashboard.users">Back to users</LinkTo>
<LinkTo @route="dashboard.users.edit" @model={{user.id}}>Edit</LinkTo>
```

```typescript
// Component — programmatic
@service declare router: RouterService;

this.router.transitionTo('dashboard.users');
this.router.transitionTo('dashboard.users.edit', userId);
```

## Session lifecycle

1. **App boot**: `ApplicationRoute.beforeModel()` calls `initializeUserLib()` which runs `session.setup()` then `currentUser.load()`
2. **Login**: form calls `session.authenticate('authenticator:jwt', data)`, custom session service overrides `handleAuthentication()` to load the current user before redirecting
3. **Route access**: `dashboard` route's `beforeModel` calls `requireAuthentication()` — redirects to `login` if unauthenticated
4. **Logout**: `logout` route calls `session.invalidate()` in `beforeModel`

```typescript
// services/session.ts
export default class MySession extends SessionService {
  @service declare currentUser: CurrentUserService;

  async handleAuthentication(routeAfterAuthentication: string): Promise<void> {
    await this.currentUser.load();
    super.handleAuthentication(routeAfterAuthentication);
  }
}
```

**Rules:**
- Feature libraries export `forRouter(this: DSL)` for authenticated routes and `authRoutes(this: DSL)` for public routes
- Call route-map functions with `.call(this)` in the main router
- Place `requireAuthentication` on the `dashboard` parent route — all children inherit the guard
- Place `prohibitAuthentication` on public-only routes like `login`
- Use `beforeModel` for guards and initialization, `model` for data loading — never `afterModel`
- Empty routes are fine — not every route needs a `model()` hook
- Export route type signatures for template type-checking
- Use `<LinkTo>` in templates, `router.transitionTo()` in JS — never use `<a href>`
- Dynamic segments use `:param_name` syntax (e.g. `{ path: '/:user_id/edit' }`)
- No controllers — use route template components for local state instead

**Why:** Centralizes route definitions in feature libraries while keeping the main router as a thin composition layer. Auth guards on parent routes eliminate repetitive guard logic on every child route. Typed route signatures bridge the gap between route data and template consumption.
