import { assert, describe } from 'vitest';
import { applicationTest } from 'ember-vitest';
import { visit } from '@ember/test-helpers';
import App from '@apps/front/app';
import { vi } from 'vitest';

vi.mock('@embroider/config-meta-loader', () => {
  return {
    default: vi.fn(() => {
      return {
        modulePrefix: '@apps/front',
        environment: 'test',
        rootURL: '/',
        locationType: 'history',
        EmberENV: {
          EXTEND_PROTOTYPES: false,
          FEATURES: {
            // Here you can enable experimental features on an ember canary build
            // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
          },
        },

        APP: {
          // Here you can pass flags/options to your application instance
          // when it is created
        },
      };
    }),
  };
});

describe('Home', () => {
  // eslint-disable-next-line no-empty-pattern
  applicationTest.scoped({ app: ({}, use) => use(App) });

  applicationTest('can visit the home screen', async () => {
    await visit('/login');
    assert.ok(true);
  });
});
