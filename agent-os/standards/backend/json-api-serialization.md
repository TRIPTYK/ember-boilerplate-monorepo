# JSON:API Serialization

Manual serializer functions paired with Zod schemas — gives full control over exposed fields and type-safe responses.

## Schema definition

Use helpers from `@libs/backend-shared`:

```ts
import { makeJsonApiDocumentSchema, makeSingleJsonApiTopDocument } from "@libs/backend-shared";

export const SerializedUserSchema = makeJsonApiDocumentSchema(
  "users",
  object({
    email: email(),
    firstName: string(),
    lastName: string(),
    // Never include password
  }),
);
```

## Serializer functions

Three functions per entity:

```ts
// Single resource
export function jsonApiSerializeUser(user: UserEntityType) {
  return {
    id: user.id,
    type: "users" as const,
    attributes: { email: user.email, firstName: user.firstName, lastName: user.lastName },
  };
}

// Single document wrapper
export function jsonApiSerializeSingleUserDocument(user: UserEntityType) {
  return { data: jsonApiSerializeUser(user) };
}

// Collection document wrapper
export function jsonApiSerializeManyUsersDocument(users: UserEntityType[]) {
  return { data: users.map(jsonApiSerializeUser) };
}
```

## Rules

- **Never expose sensitive fields** (passwords, token hashes) in serialized output
- Use `as const` on the `type` field for literal type inference
- Type must match resource name (plural): `"users"`, `"todos"`
- Schema is used for both serialization AND Fastify response validation
- Collections may include `meta: { total }` for pagination

## File naming

`{entity}.serializer.ts` (e.g., `user.serializer.ts`, `todo.serializer.ts`)
