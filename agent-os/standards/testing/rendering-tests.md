# renderingTest Pattern

Use scoped renderingTest with TestApp for all component tests.

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

**Rules:**
- Always use renderingTest.scoped with TestApp
- Call initializeTestApp before rendering
- Access services via context.owner.lookup()

**Why:** Normal app doesn't work in tests. TestApp provides isolated test environment with proper DI container.
