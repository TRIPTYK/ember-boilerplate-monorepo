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
import AuthLayout from '../auth-layout.gts';
import { LinkTo } from '@ember/routing';
import { hash } from '@ember/helper';
import type RouterService from '@ember/routing/router-service';

export default class LoginForm extends Component {
  @service declare session: SessionService;
  @service declare currentUser: CurrentUserService;
  @service declare intl: IntlService;
  @service declare router: RouterService;

  get loginValidationSchema(): ReturnType<typeof createLoginValidationSchema> {
    return createLoginValidationSchema(this.intl);
  }

  onSubmit = async (
    data: z.infer<ReturnType<typeof createLoginValidationSchema>>
  ) => {
    await this.session.authenticate('authenticator:jwt', data);
  };

  <template>
    <AuthLayout data-test-login-form>
      <h1>{{t "users.forms.login.title"}}</h1>
      <TpkLoginForm
        @onSubmit={{this.onSubmit}}
        @initialValues={{hash
          email="deflorenne.amaury@triptyk.eu"
          password="123456789"
        }}
        @loginSchema={{this.loginValidationSchema}}
        class="tpk-login-form"
      />
      <LinkTo @route="forgot-password" class="forgot-password-link">
        Forgot password?
      </LinkTo>
    </AuthLayout>
  </template>
}

export const pageObject = create({
  scope: '[data-test-login-form]',
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  password: fillable(
    '[data-test-tpk-prefab-password-container="password"] input'
  ),
  submit: clickable('button[type="submit"]'),
});
