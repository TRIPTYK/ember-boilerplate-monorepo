# Scoped Middleware

Use `fastify.register()` callbacks to scope middleware to specific route prefixes.

```typescript
// Public routes (no auth)
await fastify.register(async (f) => {
  for (const route of authRoutes) {
    route.routeDefinition(f);
  }
}, { prefix: "/auth" });

// Protected routes (with auth)
await fastify.register(async (f) => {
  f.addHook("preValidation", jwtAuthMiddleware);
  f.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({ errors: [...] });
    }
    throw error;
  });

  for (const route of userRoutes) {
    route.routeDefinition(f);
  }
}, { prefix: "/users" });
```

**Rules:**
- Scope middleware inside `fastify.register()` callback, not globally
- Use `prefix` option to group routes by access level
- Set `errorHandler` inside each scope for custom error formatting
- Public routes: `/auth/*` — Protected routes: `/users/*`

**Common mistakes:**
- Adding hooks globally instead of inside register() callback
- Using wrong prefix for public vs protected routes
- Forgetting the scoped error handler
