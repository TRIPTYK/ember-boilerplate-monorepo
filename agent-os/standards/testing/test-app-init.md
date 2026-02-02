# Test App Initialization

Call initializeTestApp before rendering components in tests.

```typescript
import { renderingTest } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app.ts';

describe('MyComponent', function() {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('test case', async function({ context }) {
    await initializeTestApp(context.owner, 'en-us');

    // Now services are ready
    const session = context.owner.lookup('service:session');
    // ...
  });
});
```

**What it does:**
```typescript
export async function initializeTestApp(owner: Owner, locale: string) {
  owner.register('session-stores:application', AdaptiveStore);
  owner.register('service:store', TestStore);
  const intl = owner.lookup('service:intl');
  intl.setLocale(locale);
  setupSession(owner);
  // Boot required services...
}
```

**Rules:**
- Call before any component rendering
- Pass locale (usually 'en-us')
- Required for session, store, intl services

**Why:** Boots services properly in test environment. Sets up DI container with test-specific implementations.
