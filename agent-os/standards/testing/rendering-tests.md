# Component Testing

Use scoped renderingTest with TestApp for all component tests.

## Test Structure

```typescript
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TestApp, initializeTestApp } from '../app.ts';
import MyComponent from '#src/components/my-component.gts';

describe('MyComponent', function() {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('renders correctly', async function({ context }) {
    await initializeTestApp(context.owner, 'en-us');

    await render(<template><MyComponent /></template>);

    // assertions...
  });
});
```

## What initializeTestApp Does

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

It registers test-specific implementations for session, store, and intl services.

## Accessing Services in Tests

```typescript
renderingTest('test case', async function({ context }) {
  await initializeTestApp(context.owner, 'en-us');

  const session = context.owner.lookup('service:session');
  // Use session for test setup...
});
```

**Rules:**
- Always use `renderingTest.scoped` with TestApp
- Call `initializeTestApp` before any rendering
- Pass locale (usually 'en-us')
- Access services via `context.owner.lookup()`

**Why:** Normal app doesn't work in tests. TestApp provides isolated test environment with proper DI container.
