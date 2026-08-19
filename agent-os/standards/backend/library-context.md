# Library Context (context.ts)

Each backend library defines a `LibraryContext` interface in `src/context.ts` for its dependencies.

## Pattern

```ts
import type { EntityManager } from "@mikro-orm/core";

export interface LibraryContext {
  em: EntityManager;
  configuration: {
    jwtSecret: string;
  };
}
```

If a library has multiple modules (like users-backend with AuthModule + UserModule), define separate context interfaces:

```ts
export interface UserLibraryContext {
  em: EntityManager;
  configuration: { jwtSecret: string };
}

export interface AuthLibraryContext {
  em: EntityManager;
  configuration: { jwtRefreshSecret: string; jwtSecret: string };
}
```

## The `em` is the root EntityManager

**`context.em` is always the root `orm.em`, never `orm.em.fork()`.** The root EM resolves the
MikroORM `RequestContext` on every call, so each HTTP request gets its own fork — its own identity
map and unit of work — shared by every library serving that request. A fork has `useContext: false`
and would never resolve the context: it would stay frozen for the whole process lifetime, leaking
memory, serving stale entities, and flushing other requests' pending changes.

The per-request context is opened by `registerRequestContext(fastify, orm.em)` from
`@libs/backend-shared`, called once in `App.init`. Nothing else in a library needs to change:
`EntityRepository` is stateless and delegates to `getEntityManager()`, so a repository captured at
boot from the root EM still resolves the request's fork.

## Rules

- Context contains only: `em` (EntityManager) + `configuration` (module-specific config/secrets)
- `em` is the **root** `orm.em` — never a fork
- **Fastify instance is NOT in the context** — it's passed to `setupRoutes(fastify)` separately (keeps modules decoupled from HTTP layer + Fastify isn't available at init time)
- Context is passed to `Module.init(context)` at startup
- Only include configuration keys the module actually needs
