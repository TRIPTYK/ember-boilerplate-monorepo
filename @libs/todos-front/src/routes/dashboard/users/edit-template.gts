import { UserChangeset } from '#src/changesets/todo.ts';
import UsersForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { UsersEditRouteSignature } from './edit.gts';

export default class UsersEditRouteTemplate extends Component<UsersEditRouteSignature> {
  changeset = new UserChangeset({
    firstName: this.args.model.user.firstName,
    lastName: this.args.model.user.lastName,
    email: this.args.model.user.email,
  });

  <template><UsersForm @changeset={{this.changeset}} /></template>
}
