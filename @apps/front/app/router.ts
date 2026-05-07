import EmberRouter from '@embroider/router';
import config from '@apps/front/config/environment';
import { forRouter as userLibRouter, authRoutes } from '@libs/users-front';
import { forRouter as todosLibRouter } from '@libs/todos-front';
import { forRouter as invoicesLibRouter } from '@libs/invoices-front';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    userLibRouter.call(this);
    todosLibRouter.call(this);
    invoicesLibRouter.call(this);
  });
  authRoutes.call(this);
});
