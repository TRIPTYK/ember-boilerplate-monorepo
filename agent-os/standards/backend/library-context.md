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

## Rules

- Context contains only: `em` (EntityManager) + `configuration` (module-specific config/secrets)
- **Fastify instance is NOT in the context** — it's passed to `setupRoutes(fastify)` separately (keeps modules decoupled from HTTP layer + Fastify isn't available at init time)
- Context is passed to `Module.init(context)` at startup
- Only include configuration keys the module actually needs
