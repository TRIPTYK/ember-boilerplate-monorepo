# Route Classes

All routes are classes implementing `Route<T>` with constructor-injected dependencies.

```typescript
export class LoginRoute implements Route {
  constructor(
    private userRepository: EntityRepository<UserEntityType>,
    private em: EntityManager,
    private jwtSecret: string,
  ) {}

  routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post("/login", { schema: {...} }, async (request, reply) => {
      // Use this.userRepository, this.em, etc.
    });
  }
}
```

**Rules:**
- Every route is a class implementing `Route<T>` interface
- Inject dependencies via constructor (repositories, EntityManager, config)
- Implement `routeDefinition(f)` to define the route
- File naming: `[action].route.ts` (e.g., `login.route.ts`)

**Why:** Enables unit testing with mocked dependencies, enforces consistent structure, avoids global state.
