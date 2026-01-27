import UsersTable from '#src/components/users-table.gts';
import type { TOC } from '@ember/component/template-only';
import Route from '@ember/routing/route';

export default class UsersIndexRoute extends Route {}

export const UsersIndexRouteTemplate = <template>
  <h1>Users Index</h1>
  <UsersTable />
</template> as TOC<{
  model: Awaited<ReturnType<UsersIndexRoute['model']>>;
  controller: undefined;
}>;

