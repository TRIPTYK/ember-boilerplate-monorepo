import { assert } from '@ember/debug';
import type Owner from '@ember/owner';
import type { DSL } from '@ember/routing/lib/dsl';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import SessionService from 'ember-simple-auth/services/session';
import Base from 'ember-simple-auth/session-stores/base';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import type CurrentUserService from './services/current-user';
import type { Store } from '@warp-drive/core';
import IntlService from 'ember-intl/services/intl';

export function moduleRegistry() {
  return buildRegistry({
    // services, routes, templates, helpers, components localement définis
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    // autres services externes
    './services/session': {
      default: SessionService,
    },
    './services/intl': {
      default: IntlService,
    }
  })();
}

export async function initialize(owner: Owner) {
  const sessionService = owner.lookup('service:session') as
    | SessionService
    | undefined;
  const currentUserService = owner.lookup('service:current-user') as
    | CurrentUserService
    | undefined;
  const storeService = owner.lookup('service:store') as Store | undefined;
  const intlService = owner.lookup('service:intl') as IntlService | undefined;
  assert('Session service must be available', sessionService);
  assert('CurrentUser service must be available', currentUserService);
}

// Création de la structure de routes de la librarie
export function forRouter(this: DSL) {
  this.route('todos', function () {
    this.route('create');
    this.route('edit', { path: '/:user_id/edit' });
  });
}
