import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosEditRouteSignature } from './edit.gts';
import { editTodoValidationSchema } from '#src/components/forms/todo-validation.ts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';

export default class TodosEditRouteTemplate extends Component<TodosEditRouteSignature> {
  @service declare intl: IntlService;

  changeset = new TodoChangeset({
    id: this.args.model.todo.id,
    title: this.args.model.todo.title,
    description: this.args.model.todo.description,
    completed: this.args.model.todo.completed,
  });

  get validationSchema() {
    return editTodoValidationSchema(this.intl);
  }

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
