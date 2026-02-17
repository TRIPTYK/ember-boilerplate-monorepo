import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosEditRouteSignature } from './edit.gts';
import { editTodoValidationSchema } from '#src/components/forms/todo-validation.ts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type Owner from '@ember/owner';

export default class TodosEditRouteTemplate extends Component<TodosEditRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof editTodoValidationSchema>;

  constructor(owner: Owner, args: TodosEditRouteSignature) {
    super(owner, args);
    this.validationSchema = editTodoValidationSchema(this.intl);
  }

  changeset = new TodoChangeset({
    id: this.args.model.todo.id,
    title: this.args.model.todo.title,
    description: this.args.model.todo.description,
    completed: this.args.model.todo.completed,
  });

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
