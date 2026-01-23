import type { TOC } from '@ember/component/template-only';
import { default as TableGenericPrefab, type TableParams } from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';

const tableParams: TableParams = {
    entity: 'users',
    pageSizes: [10, 30, 50, 75],
    defaultSortColumn: 'firstName',
    columns: [
      {
        field: 'name',
        headerName: 'Nom',
        sortable: true,
      },
      {
        field: 'email',
        headerName: 'Email',
        sortable: false,
      },
    ],
    actionMenu: [],
  };

export const UsersTable: TOC<object> = <template>
  <h1>Users Table</h1>
  <TableGenericPrefab @tableParams={{tableParams}} />
</template>;
