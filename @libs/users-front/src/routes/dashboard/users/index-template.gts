import UsersTable from '#src/components/user-table.gts';
import type { TOC } from '@ember/component/template-only';
import type UsersIndexRoute from './index.gts';
import { t } from 'ember-intl';

export default <template>
  <h1>{{t "users.pages.list.title"}}</h1>
  <UsersTable />
</template> as TOC<{
  model: Awaited<ReturnType<UsersIndexRoute['model']>>;
  controller: undefined;
}>
