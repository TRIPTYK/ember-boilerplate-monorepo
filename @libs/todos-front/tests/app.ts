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
import TodoSchema from '#src/schemas/todos.ts';

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
  schemas: [TodoSchema],
}) {}

export function initializeTestApp(owner: Owner, locale: string) {
  owner.register('service:store', TestStore);
  owner.register('service:flash-messages', FlashMessageService);
  owner.register('config:environment', { flashMessageDefaults: {} });
  // eslint-disable-next-line ember/no-private-routing-service
  const router = owner.lookup('router:main') as Router;

  router.setupRouter();
  const intl = owner.lookup('service:intl');
  intl.setLocale(locale);
  intl.setOnMissingTranslation((key) => `t:${key}`);
  setupSession(owner);
  initialize(owner);
}
