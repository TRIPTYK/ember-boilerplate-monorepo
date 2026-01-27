import EmberRouter from '@embroider/router';
import config from 'front-app/config/environment';
import { forRouter as userLibRouter, authRoutes } from '@libs/users';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', function() {
    userLibRouter.call(this);
  });
  authRoutes.call(this);
});
