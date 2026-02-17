import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';

export default class LogoutRoute extends Route {
  @service declare session: SessionService;

  async beforeModel() {
    await this.session.invalidate();
  }
}
