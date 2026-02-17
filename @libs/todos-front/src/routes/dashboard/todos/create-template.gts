import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import { createTodoValidationSchema } from '#src/components/forms/todo-validation.ts';

export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof createTodoValidationSchema>;
  changeset = new TodoChangeset({});

  constructor(owner: Owner, args: TodosCreateRouteSignature) {
    super(owner, args);
    this.validationSchema = createTodoValidationSchema(this.intl);
  }

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
