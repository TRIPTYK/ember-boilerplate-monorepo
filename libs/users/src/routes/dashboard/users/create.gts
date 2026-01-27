import Route from '@ember/routing/route';
import UsersFormComponent from '#src/components/users-form.gts';
import type { TOC } from '@ember/component/template-only';

export default class UsersCreateRoute extends Route {}

export const UsersCreateRouteTemplate = <template>
  <UsersFormComponent />
</template> as TOC<{
  model: Awaited<ReturnType<UsersCreateRoute['model']>>;
  controller: undefined;
}>;
