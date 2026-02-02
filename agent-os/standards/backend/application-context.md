# Application Context Pattern

Use ApplicationContext as a type-safe DI container for backend services.

```typescript
export interface ApplicationContext {
  configuration: AppConfiguration;
  logger: Logger;
  // Add services, repositories, etc.
}
```

**Pass context to route handlers and services:**
```typescript
export async function appRouter(fastify: FastifyInstanceType, context: ApplicationContext) {
  // Use context.logger, context.configuration, etc.
}
```

**Why:** Type-safe dependency injection without complex DI frameworks. Easier to test and understand than global imports.
