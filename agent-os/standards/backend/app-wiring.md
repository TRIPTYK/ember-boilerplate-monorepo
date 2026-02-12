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
  em: this.context.orm.em.fork(),
  configuration: {
    jwtSecret: this.context.configuration.JWT_SECRET,
  },
}),
```

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

Entities must be registered before ORM init. Module init requires a forked EntityManager from the running ORM.
