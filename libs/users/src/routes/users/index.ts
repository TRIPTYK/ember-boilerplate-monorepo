import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';

export default class UsersIndexRoute extends Route {
  async beforeModel(t: Transition) {
    await super.beforeModel(t);
    console.log('Entering users index route');
  }

  async model(p: Record<string, unknown>, t: Transition) {
    await super.model(p, t);
  }
}


