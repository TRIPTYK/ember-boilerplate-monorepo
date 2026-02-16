import { assert } from '@ember/debug';
import type Owner from '@ember/owner';
import type { DSL } from '@ember/routing/lib/dsl';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import IntlService from 'ember-intl/services/intl';
import type { Store } from '@warp-drive/core';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    './services/intl': {
      default: IntlService,
    },
  })();
}

export function initialize(owner: Owner) {
  const intlService = owner.lookup('service:intl') as IntlService | undefined;
  const storeService = owner.lookup('service:store') as Store | undefined;
  assert('Store service must be available', storeService);
  assert('Intl service must be available', intlService);
}

export function forRouter(this: DSL) {
  this.route('todos', function () {
    this.route('create');
    this.route('edit', { path: '/:todo_id/edit' });
  });
}
