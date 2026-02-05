import UsersTable from '#src/components/user-table.gts';
import type { TOC } from '@ember/component/template-only';
import type UsersIndexRoute from './index.gts';

export default <template>
  <UsersTable />
</template> as TOC<{
  model: Awaited<ReturnType<UsersIndexRoute['model']>>;
  controller: undefined;
}>
