# Application Context

Top-level container for shared backend dependencies (config, logger, ORM).

```typescript
export interface ApplicationContext {
  configuration: AppConfiguration;
  logger: Logger;
  orm: MikroORM;
}

export async function createApplicationContext(config: AppConfiguration) {
  return {
    configuration: config,
    logger: logger({ PRODUCTION_ENV: config.PRODUCTION_ENV }),
    orm: await createDatabaseConnection(config),
  } satisfies ApplicationContext;
}
```

**Usage:** Pass to feature modules when initializing them:
```typescript
const context = await createApplicationContext(config);

const UserModule = Module.init({
  em: context.orm.em.fork(),
  configuration: context.configuration,
});
```

**Relationship to ModuleInterface:** ApplicationContext is the app-level container created at startup. Feature modules (ModuleInterface) receive what they need from it during initialization.

**Rules:**
- Create once at app startup
- Pass relevant parts to feature modules via Module.init()
- Don't import ApplicationContext in feature libraries — they receive dependencies explicitly

**Why:** Type-safe dependency injection. Feature modules stay decoupled from app-level concerns.
