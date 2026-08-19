# Module System

Backend features are encapsulated as class-based modules for clear dependency boundaries.

## Structure

Each module:
- Implements `ModuleInterface` from `@libs/backend-shared`
- Has a **private constructor** and a **static `init(context)`** factory
- Receives a `context` with the **root EntityManager** (`orm.em`) and configuration
- Exposes `setupRoutes(fastify)` to register all routes

```ts
export class TodoModule implements ModuleInterface<FastifyInstanceType> {
  private constructor(private context: TodoContext) {}

  public static init(context: TodoContext): TodoModule {
    return new TodoModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceType): Promise<void> {
    // register routes, hooks, error handlers
  }
}
```

## Registration

Modules are initialized in `@apps/backend` with the root EntityManager:

```ts
todosModule: TodoModule.init({
  em: this.context.orm.em, // root EM, never a fork
  configuration: { jwtSecret: ... },
}),
```

The root EM resolves the MikroORM `RequestContext` opened per HTTP request by
`registerRequestContext`, so every module shares one fork — one identity map, one unit of work —
per request. A fork has `useContext: false` and would never resolve it; see
[library-context.md](./library-context.md).

## When to use

- Every backend feature that has routes/entities → module
- Simple shared utilities (hashing, helpers) → regular functions in `@libs/backend-shared`, no module needed
