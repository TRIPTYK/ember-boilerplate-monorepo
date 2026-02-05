# Module Interface

Backend feature modules implement `ModuleInterface` for route registration.

```typescript
// @libs/backend-shared defines the contract
export interface ModuleInterface<T extends FastifyInstance = FastifyInstance> {
  setupRoutes(fastify: T): Promise<void>;
}

// Module initialization in @apps/backend
const UserModule = Module.init({
  fastifyInstance: fastify,
  em: context.orm.em.fork(),  // Fork at module level
  configuration: { jwtSecret, jwtRefreshSecret },
});

await app.setupRoutes([UserModule]);
```

**Rules:**
- Modules are classes implementing `ModuleInterface`
- Create EntityManager fork when initializing module: `em.fork()`
- Pass fastify instance and configuration to `Module.init()`
- Call `setupRoutes()` after app is fully configured

**Why:** Simpler than per-request EM management. Modules are self-contained with their own dependencies.
