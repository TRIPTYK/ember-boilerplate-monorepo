# Monorepo Package Organization

Use `@apps/` for deployable applications, `@libs/` for shared libraries.

```
@apps/
  backend/     # Fastify API server (deployable)
  front/       # Ember frontend (deployable)

@libs/
  users/         # Frontend feature library (Ember addon)
  users-backend/ # Backend feature library (Fastify routes)
  backend-shared/ # Shared backend utilities
  repo-utils/    # Shared build/tooling utilities
```

**Rules:**
- Apps can depend on libs; libs cannot depend on apps
- Use `workspace:*` for internal dependencies
- The `@` prefix scopes packages and groups them in editors
- Package names follow: `@apps/[name]` or `@libs/[name]`

**Why:** Clear separation between deployable apps and reusable code. The @ prefix makes packages easy to identify.
