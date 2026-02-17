import Application from "ember-strict-application-resolver";
import { moduleRegistry } from "#src/index.js";
import compatModules from "@embroider/virtual/compat-modules";
import EmberRouter from "@ember/routing/router";
import type Owner from "@ember/owner";

class Router extends EmberRouter {
  location = "none";
  rootURL = "/";
}

Router.map(function () {});

export class TestApp extends Application {
  podModulePrefix = "";
  modules = {
    "./router": Router,
    ...moduleRegistry(),
    ...compatModules,
  };
}

export function initializeTestApp(owner: Owner) {
  // eslint-disable-next-line ember/no-private-routing-service
  const router = owner.lookup("router:main") as Router;
  router.setupRouter();
}
