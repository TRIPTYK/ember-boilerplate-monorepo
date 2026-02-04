import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import { t, type IntlService } from 'ember-intl';

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
          (element as { id: string }).id,
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
      actionMenu: [],
    };
  }

  onAddUser = () => {
    this.router.transitionTo('dashboard.users.create');
  };

  <template>
    <TpkButton
      @label={{t "users.table.actions.addUser"}}
      @onClick={{this.onAddUser}}
    />
    <TableGenericPrefab @tableParams={{this.tableParams}} />
  </template>
}

export default UsersTable;
