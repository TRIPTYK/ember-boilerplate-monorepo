# Testing Setup

Libs use Vitest + ember-vitest. No acceptance tests in libs — only integration and unit tests.

## File structure

```
tests/
├── app.ts              # TestApp, TestStore, initializeTestApp
├── test-helper.ts      # Global hooks (beforeEach/afterEach)
├── utils.ts            # Test utilities (stubRouter, etc.)
├── integration/        # Rendering/component tests
└── unit/               # Service/logic tests
```

## tests/app.ts

```typescript
import Application from 'ember-strict-application-resolver';
import { forRouter, initialize, moduleRegistry } from '#src/index.js';
import { moduleRegistry as inputValidationRegistry } from '@triptyk/ember-input-validation';
import IntlService from 'ember-intl/services/intl';
import compatModules from '@embroider/virtual/compat-modules';
import PageTitleService from 'ember-page-title/services/page-title';
import EmberRouter from '@ember/routing/router';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import type Owner from '@ember/owner';
import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import '@warp-drive/ember/install';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import {Entity}Schema from '#src/schemas/{entities}.ts';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

Router.map(function () {
  this.route('dashboard', function () {
    forRouter.call(this);
  });
});

export class TestApp extends Application {
  podModulePrefix = '';
  modules = {
    './router': Router,
    './services/intl': { default: IntlService },
    './services/page-title': { default: PageTitleService },
    './services/flash-message': { default: FlashMessageService },
    ...moduleRegistry(),
    ...inputValidationRegistry(),
    ...compatModules,
  };
}

export default class TestStore extends useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: true,
  cache: JSONAPICache,
  schemas: [{Entity}Schema],
}) {}

export async function initializeTestApp(owner: Owner, locale: string) {
  owner.register('service:store', TestStore);
  owner.register('service:flash-messages', FlashMessageService);
  owner.register('config:environment', { flashMessageDefaults: {} });
  const router = owner.lookup('router:main') as Router;
  router.setupRouter();
  const intl = owner.lookup('service:intl');
  intl.setLocale(locale);
  intl.setOnMissingTranslation((key) => `t:${key}`);
  setupSession(owner);
  await initialize(owner);
}
```

## tests/test-helper.ts

```typescript
import { resumeTest } from '@ember/test-helpers';
import { afterEach, beforeEach, vi } from 'vitest';

const callback = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'r') { event.preventDefault(); resumeTest(); }
};

beforeEach(() => { document.addEventListener('keydown', callback); });
afterEach(() => { document.removeEventListener('keydown', callback); vi.resetAllMocks(); });
```

## tests/utils.ts

```typescript
import type Owner from '@ember/owner';
import { vi } from 'vitest';

export function stubRouter(owner: Owner, value?: unknown) {
  const router = owner.lookup('service:router');
  router.transitionTo = vi.fn().mockResolvedValue(value);
  return router;
}
```

## Integration test pattern

```typescript
import { describe, expect as hardExpect, vi } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';

// Mock the service
vi.mock('#src/services/{entity}.ts', async (importActual) => {
  const actual = await importActual();
  return { ...actual, default: class extends actual.default { save = vi.fn(); } };
});

describe('{entity}-form', function () {
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest('test name', async function ({ context }) {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup('service:{entity}');
    const router = stubRouter(context.owner);
    const changeset = new {Entity}Changeset({});

    await render(<template><{Entity}Form @changeset={{changeset}} /></template>);
    await pageObject.title('value');
    await pageObject.submit();

    expect(service.save).toHaveBeenCalled();
  });
});
```

## Unit test pattern

```typescript
import { beforeAll, describe } from 'vitest';
import { test } from 'ember-vitest';
import { setupWorker } from 'msw/browser';

describe('Service | {Entity} | Unit', () => {
  test.scoped({ app: ({}, use) => use(TestApp) });

  beforeAll(async () => {
    const worker = setupWorker(...handlers);
    await worker.start();
    return () => { worker.stop(); };
  });

  test('creates entity', async ({ context }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup('service:{entity}');
    const changeset = new {Entity}Changeset({ title: 'Test' });
    await service.save(changeset);
  });
});
```

## Page objects

Exported from form components for reuse in tests:

```typescript
// In {entity}-form.gts
export const pageObject = create({
  scope: '[data-test-{entities}-form]',
  title: fillable('[data-test-tpk-prefab-input-container="title"] input'),
  description: fillable('[data-test-tpk-prefab-textarea-container="description"] textarea'),
  submit: clickable('button[type="submit"]'),
});
```

## Key rules

- All API calls in tests are mocked (MSW or vitest mocks)
- Use `renderingTest` for component tests, `test` for unit tests
- Always call `initializeTestApp(context.owner, locale)` first
- Mock services with `vi.mock()` for integration tests
- Use MSW `setupWorker` for unit tests that test real service behavior
