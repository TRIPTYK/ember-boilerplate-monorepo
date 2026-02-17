# Feature Libraries

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
