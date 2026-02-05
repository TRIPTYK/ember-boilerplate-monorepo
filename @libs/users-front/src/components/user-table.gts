import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import { t, type IntlService } from 'ember-intl';
import EditIcon from '#src/assets/icons/edit.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import type { TOC } from '@ember/component/template-only';

class UsersTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;

  get tableParams(): TableParams {
    return {
      entity: 'users',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.users.edit',
          (element as { id: string }).id
        );
      },
      defaultSortColumn: 'firstName',
      columns: [
        {
          field: 'firstName',
          headerName: this.intl.t('users.table.headers.firstName'),
          sortable: true,
        },
        {
          field: 'lastName',
          headerName: this.intl.t('users.table.headers.lastName'),
          sortable: true,
        },
        {
          field: 'email',
          headerName: this.intl.t('users.table.headers.email'),
          sortable: false,
        },
      ],
      actionMenu: [
      {
        icon: <template><EditIcon class="size-4" /></template> as TOC<{
          Element: SVGSVGElement;
        }>,
        action: (element: unknown) => {
          this.router.transitionTo('dashboard.users.edit', (element as { id: string }).id);
        },
        name: this.intl.t('users.table.actions.edit'),
      },
      {
        icon: <template><DeleteIcon class="size-4" /></template> as TOC<{
          Element: SVGSVGElement;
        }>,
        action: (element: unknown) => {
          console.log('Delete clicked', element);
        },
        name: this.intl.t('users.table.actions.delete'),
      },
    ],
    };
  }

  onAddUser = () => {
    this.router.transitionTo('dashboard.users.create');
  };

  <template>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{t "users.pages.list.title"}}</h1>
      <TpkButton
        @label={{t "users.table.actions.addUser"}}
        @onClick={{this.onAddUser}}
      />
    </div>
    <TableGenericPrefab @tableParams={{this.tableParams}} />
  </template>
}

export default UsersTable;
