import Component from '@glimmer/component';
import z from 'zod';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type TodoService from '#src/services/todo.ts';
import type { TodoChangeset } from '#src/changesets/todo.ts';
import { createTodoValidationSchema } from '#src/components/forms/todo-validation.ts';
import type RouterService from '@ember/routing/router-service';
import { create, fillable, clickable } from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';
import { LinkTo } from '@ember/routing';
import type ImmerChangeset from 'ember-immer-changeset';

interface TodosFormArgs {
  changeset: TodoChangeset;
}

export default class TodosForm extends Component<TodosFormArgs> {
  @service declare todo: TodoService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  get validationSchema() {
    return createTodoValidationSchema(this.intl);
  }

  onSubmit = async (
    data: z.infer<ReturnType<typeof createTodoValidationSchema>>,
    c: ImmerChangeset<z.infer<ReturnType<typeof createTodoValidationSchema>>>
  ) => {
    await this.todo.save(c);
    await this.router.transitionTo('dashboard.todos');
    this.flashMessages.success(
      this.intl.t('todos.forms.todo.messages.saveSuccess')
    );
  };

  tpkButton = () => {};

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}}
      data-test-todos-form
      as |F|
    >
      <div class="grid grid-cols-12 gap-x-6 gap-y-3 max-w-4xl">
        <F.TpkInputPrefab
          @label={{t "todos.forms.todo.labels.title"}}
          @validationField="title"
          class="col-span-12 md:col-span-4"
        />
        <F.TpkTextareaPrefab
          @label={{t "todos.forms.todo.labels.description"}}
          @validationField="description"
          class="col-span-12 md:col-span-5"
        />
        <F.TpkCheckboxPrefab
          @label={{t "todos.forms.todo.labels.completed"}}
          @validationField="completed"
          class="col-span-12 md:col-span-3"
        />
        <div class="col-span-12 flex items-center justify-between gap-2">
          <button type="submit" class="btn btn-primary">
            {{t "todos.forms.todo.actions.submit"}}
          </button>
          <LinkTo
            @route="dashboard.todos"
            class="text-sm text-primary underline text-center mt-2"
          >
            {{t "todos.forms.todo.actions.back"}}
          </LinkTo>
        </div>
      </div>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-todos-form]',
  title: fillable('[data-test-tpk-prefab-input-container="title"] input'),
  description: fillable('[data-test-tpk-prefab-textarea-container="description"] textarea'),
  completed: clickable('[data-test-tpk-prefab-checkbox-container="completed"] input'),
  submit: clickable('button[type="submit"]'),
});
