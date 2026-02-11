import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';

export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  changeset = new TodoChangeset({});

  public constructor(owner: Owner, args: TodosCreateRouteSignature) {
    super(owner, args);
  }

  <template><TodosForm @changeset={{this.changeset}} /></template>
}
