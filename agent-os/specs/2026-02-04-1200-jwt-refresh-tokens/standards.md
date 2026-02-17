# JWT Refresh Tokens - Standards

## Entity Standards

Entities use MikroORM's `defineEntity` function with property builders:

```typescript
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const ExampleEntity = defineEntity({
  name: "Example",
  tableName: "examples", // Optional: explicit table name
  properties: {
    id: p.string().primary(),
    name: p.string(),
    optionalField: p.string().nullable(),
    indexedField: p.string().index(),
    dateField: p.date(),
  },
});

export type ExampleEntityType = InferEntity<typeof ExampleEntity>;
```

## Route Standards

Routes are classes implementing the `Route` interface:

```typescript
import type { FastifyInstanceTypeForModule, Route } from "#src/init.js";
import { object, string } from "zod";

export class ExampleRoute implements Route {
  public constructor(
    private dependency: SomeDependency,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/endpoint",
      {
        schema: {
          body: object({ field: string() }),
          response: {
            200: object({ data: object({ result: string() }) }),
            400: object({ message: string(), code: string() }),
          },
        },
      },
      async (request, reply) => {
        // Handler implementation
        return reply.send({ data: { result: "value" } });
      },
    );
  }
}
```

## Module Wiring Standards

Routes are instantiated and registered in `init.ts`:

```typescript
const authRoutes: Route<FastifyInstanceTypeForModule>[] = [
  new LoginRoute(repository, secret1, secret2),
  new RefreshRoute(em, secret1, secret2),
];

await fastify.register(
  async (f) => {
    for (const route of authRoutes) {
      route.routeDefinition(f);
    }
  },
  { prefix: "/auth" },
);
```

## Export Standards

All public types and classes are exported from `index.ts`:

```typescript
export * from "#src/entities/example.entity.js";
export * from "#src/routes/example.route.js";
export * from "#src/utils/example.utils.js";
```

## Utility Function Standards

Utilities are pure functions in dedicated files:

```typescript
// token.utils.ts
import { createHash, randomBytes } from "crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
```
