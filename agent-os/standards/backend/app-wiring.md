# App Wiring

Steps to register a new backend module in `@apps/backend`.

## 1. Register entities in `database.connection.ts`

```ts
import { TodoEntity } from "@libs/todos-backend";

export function databaseConfig(config) {
  return defineConfig({
    entities: [UserEntity, RefreshTokenEntity, TodoEntity], // add here
  });
}
```

## 2. Init module in `app.ts` setupRoutes()

```ts
import { Module as TodoModule } from "@libs/todos-backend";

todosModule: TodoModule.init({
  em: this.context.orm.em, // root EM, never a fork
  configuration: {
    jwtSecret: this.context.configuration.JWT_SECRET,
  },
}),
```

The module receives the **root** EntityManager. `App.init` calls
`registerRequestContext(fastify, context.orm.em)` once, which opens a MikroORM `RequestContext` per
HTTP request; the root EM resolves that context on every call, so each request gets its own fork.
Passing `orm.em.fork()` here would freeze one identity map and one unit of work for the whole
process — see [library-context.md](./library-context.md).

## 3. Pass module to `app.router.ts` and call setupRoutes()

```ts
interface AppRouterOptions {
  todosModule: TodoModule; // add to interface
}

await todosModule.setupRoutes(fastify); // call in router body
```

## 4. Update development seeder (if needed)

Add seed data for the new module in `@apps/backend/src/seeders/development.seeder.ts`.

## Order matters

Entities must be registered before ORM init. Module init requires the root EntityManager of the
running ORM.
