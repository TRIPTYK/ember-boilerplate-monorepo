import { UserChangeset } from '#src/changesets/user.ts';
import UsersForm from '#src/components/forms/user-form.gts';
import Component from '@glimmer/component';
import type { UsersCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import { createUserValidationSchema } from '#src/components/forms/user-validation.ts';

export default class UsersCreateRouteTemplate extends Component<UsersCreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof createUserValidationSchema>;

  changeset = new UserChangeset({});
  constructor(owner: Owner, args: UsersCreateRouteSignature) {
    super(owner, args);
    this.validationSchema = createUserValidationSchema(this.intl);
  }

  <template>
    <UsersForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
