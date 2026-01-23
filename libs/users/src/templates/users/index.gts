import { UsersTable } from '#src/components/users-table.gts';
import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

interface IndexSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}


export default <template>
  {{pageTitle "Index"}}
  <UsersTable />
</template> as TOC<IndexSignature>;
