import Component from '@glimmer/component';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';
import { clickable, create, fillable } from 'ember-cli-page-object';
import { createLoginValidationSchema } from './login-validation.ts';
import type z from 'zod';
import TpkLoginForm from '@triptyk/ember-ui/components/prefabs/tpk-login';
import type CurrentUserService from '#src/services/current-user.ts';
import { t } from 'ember-intl';
import type { IntlService } from 'ember-intl';

export default class LoginForm extends Component {
  @service declare session: SessionService;
  @service declare currentUser: CurrentUserService;
  @service declare intl: IntlService;

  get loginValidationSchema(): ReturnType<typeof createLoginValidationSchema> {
    return createLoginValidationSchema(this.intl);
  }

  onSubmit = async (
    data: z.infer<ReturnType<typeof createLoginValidationSchema>>,
  ) => {
    await this.session.authenticate('authenticator:jwt', data);
  };

  <template>
    <div class="login-form-container" data-test-login-form>
      <h2>{{t "users.forms.login.title"}}</h2>
      <TpkLoginForm
        @onSubmit={{this.onSubmit}}
        @loginSchema={{this.loginValidationSchema}}
      />
    </div>
  </template>
}

export const pageObject = create({
  scope: '[data-test-login-form]',
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  password: fillable(
    '[data-test-tpk-prefab-password-container="password"] input',
  ),
  submit: clickable('button[type="submit"]'),
});
