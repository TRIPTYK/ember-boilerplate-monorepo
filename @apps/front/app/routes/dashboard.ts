import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type SessionService from "ember-simple-auth/services/session";

export default class DashboardIndexRoute extends Route {
  @service declare session: SessionService;
  @service declare router: RouterService;

  beforeModel(t: Transition) {
    this.session.requireAuthentication(t, 'login');
    this.router.transitionTo('dashboard.users');
  }
}
