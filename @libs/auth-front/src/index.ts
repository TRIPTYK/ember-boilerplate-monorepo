import { assert } from '@ember/debug';
import type Owner from '@ember/owner';
import type { DSL } from '@ember/routing/lib/dsl';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import SessionService from 'ember-simple-auth/services/session';
import IntlService from 'ember-intl/services/intl';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import { moduleRegistry as sharedModuleRegistry } from '@libs/shared-front';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    ...sharedModuleRegistry(),
    './services/session': {
      default: SessionService,
    },
    './services/intl': {
      default: IntlService,
    },
    './session-stores/local-storage': {
      default: LocalStorage,
    },
  })();
}

export async function initialize(owner: Owner) {
  const sessionService = owner.lookup('service:session') as
    | SessionService
    | undefined;
  const intlService = owner.lookup('service:intl') as IntlService | undefined;

  assert('Session service must be available', sessionService);
  assert('Intl service must be available', intlService);
  await sessionService.setup();
}

export function forRouter(this: DSL) {
  this.route('login');
  this.route('forgot-password');
  this.route('reset-password');
  this.route('logout');
}
