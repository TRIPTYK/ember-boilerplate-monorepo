import Application from 'ember-strict-application-resolver';
import { forRouter, initialize, moduleRegistry } from '#src/index.js';
import { moduleRegistry as inputValidationRegistry } from '@triptyk/ember-input-validation';
import IntlService from 'ember-intl/services/intl';
import compatModules from '@embroider/virtual/compat-modules';
import PageTitleService from 'ember-page-title/services/page-title';
import EmberRouter from '@ember/routing/router';
import SessionService from 'ember-simple-auth/services/session';
import type Owner from '@ember/owner';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import '@warp-drive/ember/install';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import setupSession from 'ember-simple-auth/initializers/setup-session';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

Router.map(function () {
  forRouter.call(this);
});

export class TestApp extends Application {
  podModulePrefix = '';
  modules = {
    './router': Router,
    './services/intl': { default: IntlService },
    './services/page-title': { default: PageTitleService },
    './session-stores/application': { default: AdaptiveStore },
    './services/session': { default: SessionService },
    './services/flash-message': { default: FlashMessageService },
    ...moduleRegistry(),
    ...inputValidationRegistry(),
    ...compatModules,
  };
}

export async function initializeTestApp(owner: Owner) {
  owner.register('service:flash-messages', FlashMessageService);
  owner.register('config:environment', { flashMessageDefaults: {} });
  // eslint-disable-next-line ember/no-private-routing-service
  const router = owner.lookup('router:main') as Router;

  router.setupRouter();
  const intl = owner.lookup('service:intl');
  intl.setLocale('en-us');
  intl.setOnMissingTranslation((key) => `t:${key}`);
  setupSession(owner);
  await initialize(owner);
}
