# MikroORM Patterns

Use runtime entity definitions with `defineEntity()`, not decorators.

**Entity definition:**
```typescript
import { defineEntity, p, InferEntity } from "@mikro-orm/core";

export const UserEntity = defineEntity({
  name: "User",
  properties: {
    id: p.string().primary(),
    email: p.string(),
    firstName: p.string(),
    password: p.string(),
  },
});

export type UserEntityType = InferEntity<typeof UserEntity>;
```

**Persistence:**
```typescript
// Create entity (in memory only)
userRepository.create({ id: "...", email: "..." });

// MUST flush to persist
await em.flush();

// Bulk update with wrap()
wrap(user).assign(body.data.attributes);
await em.flush();
```

**Rules:**
- Use `defineEntity()` with runtime property builders, not decorators
- Export type with `InferEntity<typeof Entity>`
- Always call `em.flush()` after create/update operations
- Use `wrap(entity).assign(obj)` for bulk property updates

**Common mistake:** Using `@Entity` decorators instead of `defineEntity()`. This codebase uses the runtime definition approach.
