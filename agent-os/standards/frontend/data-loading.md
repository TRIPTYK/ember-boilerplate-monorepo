# WarpDrive Data Loading

Load data using `store.request()` with JSON:API request builders from `@warp-drive/utilities/json-api`.

## Store setup

The store configures a request pipeline: `AuthHandler` -> `LegacyNetworkHandler` -> `Fetch`, cached by `JSONAPICache`.

```typescript
// services/store.ts
import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import { CacheHandler, Fetch, RequestManager } from '@warp-drive/core';
import { LegacyNetworkHandler } from '@warp-drive/legacy/compat';
import AuthHandler from '#src/handlers/auth';
import UserSchema from '#src/schemas/users';

const legacyStore = useLegacyStore({
  cache: JSONAPICache,
  schemas: [UserSchema],
  handlers: [],
});

export default class MyStore extends legacyStore {
  constructor(owner: Owner) {
    super(owner);
    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(this)!);
    const manager = new RequestManager();
    setOwner(manager, getOwner(this)!);
    this.requestManager = manager
      .use([authHandler, LegacyNetworkHandler, Fetch])
      .useCache(CacheHandler);
  }
}
```

## Schema definitions

Define schemas in `schemas/` using `withDefaults` from the legacy migration path. Export the resource type alongside.

```typescript
// schemas/users.ts
import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const UserSchema = withDefaults({
  type: 'users',
  fields: [
    { name: 'firstName', kind: 'attribute' },
    { name: 'lastName', kind: 'attribute' },
    { name: 'email', kind: 'attribute' },
  ],
});

export default UserSchema;

export type User = WithLegacy<{
  firstName: string;
  lastName: string;
  email: string;
  [Type]: 'users';
}>;
```

## Reading data

### Single record in a route `model()` hook

```typescript
// routes/dashboard/users/edit.gts
import { findRecord } from '@warp-drive/utilities/json-api';

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

### Collection with custom resource path (service)

Use `resourcePath` to override the default URL when the endpoint does not match the resource type.

```typescript
// services/current-user.ts
import { query } from '@warp-drive/utilities/json-api';

export default class CurrentUserService extends Service {
  @service declare store: Store;
  @tracked user?: User;

  async load() {
    const response = await this.store.request<ReactiveDataDocument<User>>(
      query<User>('users', {}, { resourcePath: 'users/profile' })
    );
    this.user = response.content.data;
  }
}
```

### Collection with pagination, sorting, and filtering

Pass `{ reload: true }` to bypass the cache when fresh data is required.

```typescript
import { query } from '@warp-drive/utilities/json-api';

const response = await this.store.request(
  query('users', {
    include: [],
    'page[size]': 30,
    'page[number]': 1,
    sort: 'firstName',
    'filter[search]': searchTerm,
  }, { reload: true })
);

const users = response.content.data;
const total = response.content.meta.total;
```

## Writing data

CRUD operations live in a dedicated service per resource. Use `createRecord`, `updateRecord`, and `deleteRecord` builders. Build the request body by peeking into the cache.

```typescript
// services/user.ts
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';

export default class UserService extends Service {
  @service declare store: Store;

  async create(data: CreateUserData) {
    const user = this.store.createRecord<User>('users', data);
    const request = createRecord(user);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(user)),
    });
    return this.store.request(request);
  }

  update(data: UpdateUserData) {
    const existing = this.store.peekRecord<User>({ id: data.id, type: 'users' });
    assert('User must exist to be updated', existing);
    const request = updateRecord(existing);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    return this.store.request(request);
  }

  delete(data: { id: string }) {
    const existing = this.store.peekRecord<User>({ id: data.id, type: 'users' });
    assert('User must exist to be deleted', existing);
    return this.store.request(deleteRecord(existing));
  }
}
```

## Cache behavior

| Scenario | Strategy |
|---|---|
| Single record (`findRecord`) | Default caching — serves from cache if present |
| Collection lists (tables) | Pass `{ reload: true }` to always fetch fresh data |
| Custom endpoints (`resourcePath`) | Default caching |
| After create/update/delete | Navigate back to the list route — the table reloads automatically via `{ reload: true }` |

**Rules:**
- Always use `store.request()` with request builders — never use `fetch()` directly
- Import builders from `@warp-drive/utilities/json-api` (`findRecord`, `query`, `createRecord`, `updateRecord`, `deleteRecord`)
- Define schemas in `schemas/` using `withDefaults`, export both the schema and the `WithLegacy<>` type
- Register every schema in the store's `schemas` array
- Place CRUD operations in a dedicated service per resource (e.g. `services/user.ts`)
- Use `resourcePath` option when the API endpoint does not match the resource type
- Pass `{ reload: true }` for collection queries that must show fresh data (tables, lists)
- Build write request bodies with `this.store.cache.peek(cacheKeyFor(record))`
- Unwrap responses via `response.content.data` (single/array) and `response.content.meta` (pagination)
- Load data in route `model()` hooks for route-level data, in services for shared/global data

**Why:** Centralizes all API communication through WarpDrive's request pipeline, ensuring auth tokens are injected, responses are cached consistently, and JSON:API payloads are parsed automatically. Keeps data fetching patterns predictable across the codebase.
