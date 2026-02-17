import { UserChangeset } from '#src/changesets/user.ts';
import UsersForm from '#src/components/forms/user-form.gts';
import Component from '@glimmer/component';
import type { UsersEditRouteSignature } from './edit.gts';
import { editUserValidationSchema } from '#src/components/forms/user-validation.ts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type Owner from '@ember/owner';

export default class UsersEditRouteTemplate extends Component<UsersEditRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof editUserValidationSchema>;

  constructor(owner: Owner, args: UsersEditRouteSignature) {
    super(owner, args);
    this.validationSchema = editUserValidationSchema(this.intl);
  }

  changeset = new UserChangeset({
    id: this.args.model.user.id,
    firstName: this.args.model.user.firstName,
    lastName: this.args.model.user.lastName,
    password: undefined,
    email: this.args.model.user.email,
  });

  <template>
    <UsersForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
