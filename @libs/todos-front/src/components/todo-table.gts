import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import TpkConfirmModalPrefab from '@triptyk/ember-ui/components/prefabs/tpk-confirm-modal-prefab';
import { t, type IntlService } from 'ember-intl';
import EditIcon from '#src/assets/icons/edit.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import CompletedIcon from '#src/assets/icons/completed.gts';
import type { TOC } from '@ember/component/template-only';
import type TodoService from '#src/services/todo.ts';
import type { UpdateTodoData } from './forms/todo-validation';
import { tracked } from '@glimmer/tracking';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import { hash } from '@ember/helper';
import type { Todo } from '#src/schemas/todos.ts';
import TpkCheckboxComponent from '@triptyk/ember-input/components/tpk-checkbox';

interface TodoCheckboxComponentArgs {
  Args: {
    row: Todo;
  },
  Blocks: {
    default: [],
  },
}

const TodoCheckboxComponent: TOC<TodoCheckboxComponentArgs> = <template>
  <TpkCheckboxComponent
    @label="123"
    @checked={{@row.completed}}
    as |C|
  >
    <C.Input class="checkbox disabled" />
  </TpkCheckboxComponent>
</template>;

class TodosTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare todo: TodoService;
  @service declare flashMessages: FlashMessagesService;

  @tracked selectedTodoForDelete: UpdateTodoData | null = null;

  get isModalOpen(): boolean {
    return this.selectedTodoForDelete !== null;
  }

  get confirmQuestion(): string {
    return this.intl.t('todos.table.confirmModal.question');
  }

  get tableParams(): TableParams {
    return {
      entity: 'todos',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.todos.edit',
          (element as { id: string }).id
        );
      },
      defaultSortColumn: 'title',
      columns: [
        {
          field: 'title',
          headerName: this.intl.t('todos.table.headers.title'),
          sortable: true,
        },
        {
          field: 'description',
          headerName: this.intl.t('todos.table.headers.description'),
          sortable: true,
        },
        {
          field: 'completed',
          headerName: this.intl.t('todos.table.headers.completed'),
          sortable: false,
          component: "todoCheckbox"
        },
      ],
      actionMenu: [
      {
        icon: <template><EditIcon class="size-4" /></template> as TOC<{
          Element: SVGSVGElement;
        }>,
        action: (element: unknown) => {
          this.router.transitionTo('dashboard.todos.edit', (element as { id: string }).id);
        },
        name: this.intl.t('todos.table.actions.edit'),
      },
      {
        icon: <template><CompletedIcon class="size-4" /></template> as TOC<{
          Element: SVGSVGElement;
        }>,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        action: async (element: unknown) => {
          await this.onChangeCompleted(element as UpdateTodoData);
        },
        name: this.intl.t('todos.table.actions.changeCompleted'),
      },
      {
        icon: <template><DeleteIcon class="size-4" /></template> as TOC<{
          Element: SVGSVGElement;
        }>,
        action: (element: unknown) => {
          this.openModalOnDelete(element as UpdateTodoData);
        },
        name: this.intl.t('todos.table.actions.delete'),
      },
    ],
    };
  }

  onChangeCompleted = async (element: UpdateTodoData) => {
    element.completed = !element.completed;
    await this.todo.update(element);
  };

  onAddTodo = () => {
    this.router.transitionTo('dashboard.todos.create');
  };

  openModalOnDelete = (element: UpdateTodoData) => {
    this.selectedTodoForDelete = element;
  };

  onCloseModal = () => {
    this.selectedTodoForDelete = null;
  };

  onConfirmDelete = async () => {
    if (this.selectedTodoForDelete) {
      try {
        await this.todo.delete(this.selectedTodoForDelete);
        this.flashMessages.success(this.intl.t('todos.forms.todo.messages.deleteSuccess'));
      } catch {
        this.flashMessages.danger(this.intl.t('todos.forms.todo.messages.deleteError'));
      }
      this.onCloseModal();
    }
  };

  <template>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{t "todos.pages.list.title"}}</h1>
      <TpkButton
        @label={{t "todos.table.actions.addTodo"}}
        @onClick={{this.onAddTodo}}
      />
    </div>
    <TableGenericPrefab
      @tableParams={{this.tableParams}}
      @columnsComponent={{hash
        todoCheckbox=(component
          TodoCheckboxComponent
        )
      }}
    />
    <TpkConfirmModalPrefab
      @onClose={{this.onCloseModal}}
      @onConfirm={{this.onConfirmDelete}}
      @icon=""
      @cancelText={{t "global.cancel"}}
      @confirmText={{t "global.confirm"}}
      @confirmQuestion={{this.confirmQuestion}}
      @isOpen={{this.isModalOpen}}
    />
  </template>
}

export default TodosTable;
