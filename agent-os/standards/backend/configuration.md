# Configuration via Zod

Validate all environment variables using Zod schemas.

```typescript
const schema = object({
  PORT: string().transform(Number),
  DATABASE_URI: string(),
  DEBUG: string().transform((v) => v === 'true').default(false),
});

export type AppConfiguration = z.infer<typeof schema>;

export function loadConfiguration() {
  return schema.parse(process.env);
}
```

**Rules:**
- UPPER_CASE env var names
- Use transforms for type coercion (string to number/boolean)
- Fail fast at startup if config is invalid

**Why:** Catch missing or invalid config at startup, not during runtime. Type-safe config throughout the app.
