import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import TpkForgotPasswordForm from '@triptyk/ember-ui/components/prefabs/tpk-forgot-password';
import AuthLayout from '../auth-layout.gts';
import createForgotPasswordValidationSchema from './forgot-password-validation.ts';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';

export default class ForgotPasswordTemplate extends Component {
  @service declare intl: IntlService;

  get forgotPasswordValidationSchema(): ReturnType<
    typeof createForgotPasswordValidationSchema
  > {
    return createForgotPasswordValidationSchema(this.intl);
  }

  onSubmit = async () => {};
  <template>
    <AuthLayout>
      <h1>Forgot password</h1>
      <TpkForgotPasswordForm
        @onSubmit={{this.onSubmit}}
        @forgotPasswordSchema={{this.forgotPasswordValidationSchema}}
        class="tpk-login-form"
      />
      <LinkTo @route="login" class="login-link">Back to login</LinkTo>
    </AuthLayout>
  </template>
}
