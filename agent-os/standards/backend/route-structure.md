# Route Structure

Routes are class-based for dependency injection and consistency across all modules.

## Pattern

Each route:
- Implements `Route<FastifyInstanceType>` from `@libs/backend-shared`
- Receives dependencies (repositories, EntityManager) via constructor
- Exposes a single `routeDefinition(f)` method

```ts
export class CreateRoute implements Route<FastifyInstanceType> {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceType) {
    return f.post(
      "/",
      {
        schema: {
          body: makeSingleJsonApiTopDocument(/* input schema */),
          response: { 200: makeSingleJsonApiTopDocument(SerializedTodoSchema) },
        },
      },
      async (request, reply) => { /* handler */ },
    );
  }
}
```

## Registration

Routes are collected in an array and registered in the module's `setupRoutes()`:

```ts
const routes: Route<FastifyInstanceType>[] = [
  new CreateRoute(repository),
  new ListRoute(em),
  new GetRoute(repository),
  new UpdateRoute(repository),
  new DeleteRoute(repository),
];

for (const route of routes) {
  route.routeDefinition(f);
}
```

## File naming

One file per route: `{action}.route.ts` (e.g., `create.route.ts`, `login.route.ts`)

## Common mistake

Always use JSON:API schema wrappers (`makeSingleJsonApiTopDocument`, `makeJsonApiDocumentSchema`) for `body` and `response` schemas — don't pass raw Zod objects.
