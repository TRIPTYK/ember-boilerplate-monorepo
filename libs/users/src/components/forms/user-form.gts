import Component from '@glimmer/component';
import z, { object, string, email } from 'zod';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type UserService from '#src/services/user.ts';
import type { UserChangeset } from '#src/changesets/user.ts';
import { UserValidationSchema } from '#src/components/forms/user-validation.ts';
import type RouterService from '@ember/routing/router-service';
import {
  create,
  fillable,
  clickable,
} from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';

interface UsersFormArgs {
  changeset: UserChangeset;
}

export default class UsersForm extends Component<UsersFormArgs> {
  @service declare user: UserService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;

  validationSchema = object({
    firstName: string().min(2, 'At least 2 characters'),
    lastName: string().min(2, 'At least 2 characters'),
    email: email('Invalid email'),
    id: string().optional(),
  });

  onSubmit = async (data: z.infer<typeof UserValidationSchema>) => {
    await this.user.save(data);
    await this.router.transitionTo('dashboard.users');
    this.flashMessages.success('User saved successfully.');
  }

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}}
      data-test-users-form
    as |F|>
      <F.TpkInputPrefab @label="First Name" @validationField="firstName" />
      <F.TpkInputPrefab @label="Last Name" @validationField="lastName" />
      <F.TpkEmailPrefab @label="Email" @validationField="email" />
      <button type="submit">Submit</button>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-users-form]',
  firstName: fillable('[data-test-tpk-prefab-input-container="firstName"] input'),
  lastName: fillable('[data-test-tpk-prefab-input-container="lastName"] input'),
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  submit: clickable('button[type="submit"]'),
});
