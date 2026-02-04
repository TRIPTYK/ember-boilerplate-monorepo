import Component from '@glimmer/component';
import z from 'zod';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type UserService from '#src/services/user.ts';
import type { UserChangeset } from '#src/changesets/user.ts';
import { createUserValidationSchema } from '#src/components/forms/user-validation.ts';
import type RouterService from '@ember/routing/router-service';
import { create, fillable, clickable } from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';

interface UsersFormArgs {
  changeset: UserChangeset;
}

export default class UsersForm extends Component<UsersFormArgs> {
  @service declare user: UserService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  get validationSchema() {
    return createUserValidationSchema(this.intl);
  }

  onSubmit = async (
    data: z.infer<ReturnType<typeof createUserValidationSchema>>,
  ) => {
    await this.user.save(data);
    await this.router.transitionTo('dashboard.users');
    this.flashMessages.success(
      this.intl.t('users.forms.user.messages.saveSuccess'),
    );
  };

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}}
      data-test-users-form
      as |F|
    >
      <F.TpkInputPrefab
        @label={{t "users.forms.user.labels.firstName"}}
        @validationField="firstName"
      />
      <F.TpkInputPrefab
        @label={{t "users.forms.user.labels.lastName"}}
        @validationField="lastName"
      />
      <F.TpkEmailPrefab
        @label={{t "users.forms.user.labels.email"}}
        @validationField="email"
      />
      <button type="submit">{{t "users.forms.user.actions.submit"}}</button>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-users-form]',
  firstName: fillable(
    '[data-test-tpk-prefab-input-container="firstName"] input',
  ),
  lastName: fillable('[data-test-tpk-prefab-input-container="lastName"] input'),
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  submit: clickable('button[type="submit"]'),
});
