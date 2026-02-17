# Module System

Backend features are encapsulated as class-based modules for clear dependency boundaries.

## Structure

Each module:
- Implements `ModuleInterface` from `@libs/backend-shared`
- Has a **private constructor** and a **static `init(context)`** factory
- Receives a `context` with a **forked EntityManager** and configuration
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

Modules are initialized in `@apps/backend` with a forked EntityManager:

```ts
todosModule: TodoModule.init({
  em: this.context.orm.em.fork(),
  configuration: { jwtSecret: ... },
}),
```

## When to use

- Every backend feature that has routes/entities → module
- Simple shared utilities (hashing, helpers) → regular functions in `@libs/backend-shared`, no module needed
