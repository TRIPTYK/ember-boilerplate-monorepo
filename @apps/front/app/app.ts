import '@warp-drive/ember/install';
import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import config from './config/environment';
import './styles/app.css';
import environment from './config/environment';
import EmberSimpleAuthInitializer from 'ember-simple-auth/initializers/ember-simple-auth';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);

  // eslint-disable-next-line ember/classic-decorator-hooks
  init(...args: unknown[]) {
    super.init(args);
    console.log(environment);
    this.register('config:environment', environment);
    EmberSimpleAuthInitializer.initialize(this);
  }
}

loadInitializers(App, config.modulePrefix, compatModules);
