# Barrel Exports (index.ts)

Each backend library exports all public modules and an `entities` array from `src/index.ts`.

## Pattern

```ts
import { TodoEntity } from "#src/entities/todo.entity.js";

export * from "#src/entities/todo.entity.js";
export * from "#src/routes/create.route.js";
export * from "#src/routes/list.route.js";
// ... all routes, serializers, utils
export * from "#src/init.js";

export const entities = [TodoEntity];
```

## Rules

- Re-export everything public: entities, routes, serializers, utils, module class
- Export an `entities` array containing all MikroORM entities of the library
- The `entities` array is consumed by `@apps/backend` in `database.connection.ts` and by test `global-setup.ts`
- MikroORM requires explicit entity registration — no auto-discovery
