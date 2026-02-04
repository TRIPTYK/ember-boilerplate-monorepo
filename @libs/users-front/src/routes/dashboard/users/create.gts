import Route from '@ember/routing/route';

export type UsersCreateRouteSignature = {
  model: Awaited<ReturnType<UsersCreateRoute['model']>>;
  controller: undefined;
};

export default class UsersCreateRoute extends Route {}
