import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosEditRouteSignature } from './edit.gts';

export default class TodosEditRouteTemplate extends Component<TodosEditRouteSignature> {
  changeset = new TodoChangeset({
    id: this.args.model.todo.id,
    title: this.args.model.todo.title,
    description: this.args.model.todo.description,
    completed: this.args.model.todo.completed,
  });

  <template><TodosForm @changeset={{this.changeset}} /></template>
}
