# Services

Extend `Service` from `@ember/service` for feature-specific logic. Place CRUD operations in stateless data services and shared reactive state in state-holder services.

## Service locations

| Location | Purpose | Example |
|---|---|---|
| `@apps/front/app/services/` | App-level overrides and configuration | `session.ts`, `store.ts` |
| `@libs/[feature]-front/src/services/` | Feature-specific data and state services | `user.ts`, `current-user.ts` |

Library services are registered into the Ember container via `moduleRegistry()` using `import.meta.glob('./services/**/*.{js,ts}', { eager: true })` and `buildRegistry` from `ember-strict-application-resolver`.

## Data service (stateless CRUD)

One service per resource. Wraps WarpDrive store operations behind a public API. No `@tracked` state.

```typescript
// services/user.ts
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';

export default class UserService extends Service {
  @service declare store: Store;

  async save(data: ValidatedUser) {
    if (data.id) {
      return this.update(data as UpdateUserData);
    }
    return this.create(data as CreateUserData);
  }

  delete(data: { id: string }) {
    const existing = this.store.peekRecord<User>({ id: data.id, type: 'users' });
    assert('User must exist to be deleted', existing);
    return this.store.request(deleteRecord(existing));
  }

  private async create(data: CreateUserData) {
    const user = this.store.createRecord<User>('users', data);
    const request = createRecord(user);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(user)),
    });
    return this.store.request(request);
  }

  private update(data: UpdateUserData) {
    const existing = this.store.peekRecord<User>({ id: data.id, type: 'users' });
    assert('User must exist to be updated', existing);
    const request = updateRecord(existing);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    return this.store.request(request);
  }
}
```

## State-holder service (reactive shared state)

Holds `@tracked` state that components and routes can consume reactively. Expose a `load()` method for async initialization.

```typescript
// services/current-user.ts
import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Store } from '@warp-drive/core';
import { query } from '@warp-drive/utilities/json-api';

export default class CurrentUserService extends Service {
  @service declare store: Store;
  @service declare session: SessionService;
  @tracked user?: User;

  get currentUser(): User {
    if (!this.user) {
      throw new Error('No current user set');
    }
    return this.user;
  }

  async load() {
    if (!this.session.isAuthenticated) {
      this.user = undefined;
      return;
    }
    const response = await this.store.request<ReactiveDataDocument<User>>(
      query<User>('users', {}, { resourcePath: 'users/profile' })
    );
    this.user = response.content.data;
  }
}
```

## App-level service override

Override third-party services in `@apps/front/app/services/` to add app-specific behavior.

```typescript
// @apps/front/app/services/session.ts
import { service } from '@ember/service';
import type CurrentUserService from '@libs/users-front/services/current-user';
import SessionService from 'ember-simple-auth/services/session';

export default class MySession extends SessionService {
  @service declare currentUser: CurrentUserService;

  async handleAuthentication(routeAfterAuthentication: string): Promise<void> {
    await this.currentUser.load();
    super.handleAuthentication(routeAfterAuthentication);
  }
}
```

## Injection

Use `@service declare` for dependency injection. Type the declaration with the service's class or interface.

```typescript
import { service } from '@ember/service';

// Ember built-in
@service declare router: RouterService;

// Third-party addon
@service declare intl: IntlService;
@service declare session: SessionService;
@service declare flashMessages: FlashMessageService;

// Custom services
@service declare store: Store;
@service declare currentUser: CurrentUserService;
@service declare user: UserService;
```

## Flash messages

Inject `flashMessages` and use translated strings. Two severity levels: `success` and `danger`.

```typescript
@service declare flashMessages: FlashMessageService;
@service declare intl: IntlService;

// After a successful action
this.flashMessages.success(this.intl.t('users.forms.user.messages.saveSuccess'));

// On error
this.flashMessages.danger(this.intl.t('users.forms.user.messages.deleteError'));
```

Flash messages render globally in the application template via `flashMessages.arrangedQueue`.

## Testing services

**Mock a service with `vi.mock()`** — replace the module with a subclass that stubs methods:

```typescript
vi.mock('#src/services/user.ts', async (importActual) => {
  const actual = await importActual<typeof import('#src/services/user.ts')>();
  return {
    ...actual,
    default: class MockUserService extends actual.default {
      save = vi.fn();
    },
  };
});
```

**Spy on service methods with `vi.spyOn()`** — for unit tests where you need the real service:

```typescript
const service = context.owner.lookup('service:current-user') as CurrentUserService;
vi.spyOn(service.session, 'isAuthenticated', 'get').mockReturnValue(false);
vi.spyOn(service.store, 'request').mockResolvedValue({
  content: { data: mockUser },
} as never);
```

**Rules:**
- One data service per resource — name it after the resource (e.g. `user.ts` for users)
- Data services are stateless — no `@tracked` properties, only store operations
- State-holder services use `@tracked` for reactive state and expose a `load()` method for async initialization
- App-level overrides (session, store) live in `@apps/front/app/services/`
- Feature-specific services live in `@libs/[feature]-front/src/services/`
- Always use `@service declare` with a type annotation — never use `this.owner.lookup()` in application code
- Flash messages always use `intl.t()` for translated strings — never hardcoded text
- Use `vi.mock()` with class extension to stub service methods in integration tests
- Use `vi.spyOn()` for targeted mocking in unit tests

**Why:** Splitting services into data (stateless CRUD) and state (reactive holders) keeps responsibilities clear. Feature libraries own their services while the app layer handles cross-cutting overrides. Consistent injection and testing patterns make services predictable across the codebase.
