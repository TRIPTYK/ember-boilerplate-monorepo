import Route from '@ember/routing/route';

export type TodosCreateRouteSignature = {
  model: Awaited<ReturnType<TodosCreateRoute['model']>>;
  controller: undefined;
};

export default class TodosCreateRoute extends Route {}
