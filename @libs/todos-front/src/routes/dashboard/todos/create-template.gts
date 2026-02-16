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
  changeset = new TodoChangeset({});

  get validationSchema() {
    return createTodoValidationSchema(this.intl);
  }

  public constructor(owner: Owner, args: TodosCreateRouteSignature) {
    super(owner, args);
  }

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
