import Route from '@ember/routing/route';

export default class UsersCreateRoute extends Route {
  beforeModel() {
    console.log('Entering users create route');
  }
}
