import EmberRouter from '@embroider/router';
import config from 'front-app/config/environment';
import { forRouter as userLibRouter } from '@libs/users';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  userLibRouter.call(this);
});
