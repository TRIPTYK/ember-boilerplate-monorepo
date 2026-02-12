# Entity Definitions

Use MikroORM's functional `defineEntity` API (not decorators).

## Pattern

```ts
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TodoEntity = defineEntity({
  name: "Todo",
  properties: {
    id: p.string().primary(),
    title: p.string(),
    completed: p.boolean().default(false),
    userId: p.string().index(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type TodoEntityType = InferEntity<typeof TodoEntity>;
```

## Rules

- Always export both the entity (`TodoEntity`) and its inferred type (`TodoEntityType`)
- Use `p.string()`, `p.boolean()`, `p.date()` etc. with chained modifiers: `.primary()`, `.nullable()`, `.index()`, `.default()`, `.onCreate()`
- Use `tableName` when the table name differs from the entity name (e.g., `refresh_tokens`)
- **Store dates as ISO strings** (`p.string()` + `.onCreate(() => new Date().toISOString())`), not Date objects — keeps the format consistent across DB, API, and frontend

## Updates

Use `wrap(entity).assign()` for partial updates, then `em.flush()`:

```ts
wrap(todo).assign(body.data.attributes);
await repository.getEntityManager().flush();
```

## File naming

`{entity}.entity.ts` (e.g., `user.entity.ts`, `todo.entity.ts`)
