import '@warp-drive/ember/install';
import ApplicationStrict from 'ember-strict-application-resolver';
import compatModules from '@embroider/virtual/compat-modules';
import loadInitializers from 'ember-load-initializers';
import config from 'front-app/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import "front-app/styles/app.css";
import IntlService from 'ember-intl/services/intl';
import PageTitleService from 'ember-page-title/services/page-title';
import { moduleRegistry as userLibRegistry, initialize } from '@libs/users';

// @ts-expect-error: setWarpDriveLogging is globally available after importing '@warp-drive/ember/install'
setWarpDriveLogging({
  LOG_CACHE: true,
  LOG_REQUESTS: true,
})

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}


export default class App extends ApplicationStrict {
  podModulePrefix = config.podModulePrefix;
  inspector = setupInspector(this);
  modules = {
    ...compatModules,
    ...import.meta.glob('./router.*', { eager: true }),
    ...import.meta.glob('./templates/**/*', { eager: true }),
    ...import.meta.glob('./services/**/*', { eager: true }),
    ...import.meta.glob('./routes/**/*', { eager: true }),
    ...import.meta.glob('./components/**/*', { eager: true }),
    ...import.meta.glob('./config/**/*', { eager: true }),
    // third party services, there is no better way to load them currently
    './services/intl': { default: IntlService},
    './services/page-title': { default: PageTitleService},
    ...compatModules,
    ...userLibRegistry(),
  }
}

loadInitializers(App, config.modulePrefix, compatModules);
