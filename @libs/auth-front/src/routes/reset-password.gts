import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';

export type ResetPasswordRouteSignature = {
  model: { token: string };
  controller: undefined;
};

export default class ResetPasswordRoute extends Route {
  @service declare session: SessionService;
  @service declare router: RouterService;

  queryParams = {
    token: {
      refreshModel: true,
    },
  };

  beforeModel(transition: Transition) {
    this.session.prohibitAuthentication('application');
    const token = transition.to?.queryParams?.token;
    if (!token) {
      this.router.transitionTo('login');
    }
  }

  model(params: Record<string, unknown>, transition: Transition) {
    const tokenFromTransition = transition?.to?.queryParams?.token as
      | string
      | undefined;
    const tokenFromParams = params.token as string | undefined;
    const token: string = tokenFromTransition || tokenFromParams || '';
    return { token };
  }
}
