import Component from '@glimmer/component';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type UserService from '#src/services/user.ts';
import type { UserChangeset } from '#src/changesets/user.ts';
import {
  createUserValidationSchema,
  editUserValidationSchema,
  type UpdatedUser,
  type ValidatedUser,
} from '#src/components/forms/user-validation.ts';
import type RouterService from '@ember/routing/router-service';
import { create, fillable, clickable, isPresent } from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';
import { LinkTo } from '@ember/routing';
import type ImmerChangeset from 'ember-immer-changeset';
import HandleSaveService from '@libs/shared-front/services/handle-save';

interface UsersFormArgs {
  changeset: UserChangeset;
  validationSchema:
    | ReturnType<typeof createUserValidationSchema>
    | ReturnType<typeof editUserValidationSchema>;
}

interface UserFormSignature {
  Args: UsersFormArgs;
  Blocks: {
    default: [];
  };
}

export default class UsersForm extends Component<UserFormSignature> {
  @service declare user: UserService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare handleSave: HandleSaveService;

  get isCreate() {
    return !this.args.changeset.get('id');
  }

  onSubmit = async (
    _data: ValidatedUser | UpdatedUser,
    c: ImmerChangeset<ValidatedUser | UpdatedUser>
  ) => {
    await this.handleSave.handleSave({
      saveAction: () => this.user.save(c),
      changeset: c,
      successMessage: 'users.forms.user.messages.createSuccess',
      transitionOnSuccess: 'dashboard.users',
    });
  };

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{@validationSchema}}
      data-test-users-form
      as |F|
    >
      <div class="grid grid-cols-12 gap-x-6 gap-y-3 max-w-4xl">
        <F.TpkInputPrefab
          @label={{t "users.forms.user.labels.firstName"}}
          @validationField="firstName"
          class="col-span-12 md:col-span-3"
        />
        <F.TpkInputPrefab
          @label={{t "users.forms.user.labels.lastName"}}
          @validationField="lastName"
          class="col-span-12 md:col-span-3"
        />
        {{#if this.isCreate}}
          <F.TpkPasswordPrefab
            @label={{t "users.forms.user.labels.password"}}
            @validationField="password"
            class="col-span-12 md:col-span-3"
          />
        {{/if}}
        <F.TpkEmailPrefab
          @label={{t "users.forms.user.labels.email"}}
          @validationField="email"
          class="col-span-12 md:col-span-3"
        />
        <div class="col-span-12 flex items-center justify-between gap-2">
          <button type="submit" class="btn btn-primary">
            {{t "users.forms.user.actions.submit"}}
          </button>
          <LinkTo
            @route="dashboard.users"
            class="text-sm text-primary underline text-center mt-2"
          >
            {{t "users.forms.user.actions.back"}}
          </LinkTo>
        </div>
      </div>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-users-form]',
  firstName: fillable(
    '[data-test-tpk-prefab-input-container="firstName"] input'
  ),
  lastName: fillable('[data-test-tpk-prefab-input-container="lastName"] input'),
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  password: fillable(
    '[data-test-tpk-prefab-password-container="password"] input'
  ),
  isPasswordVisible: isPresent(
    '[data-test-tpk-prefab-password-container="password"] input'
  ),
  submit: clickable('button[type="submit"]'),
});
