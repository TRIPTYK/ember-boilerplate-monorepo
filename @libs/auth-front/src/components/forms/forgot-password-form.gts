import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import TpkForgotPasswordForm from '@triptyk/ember-ui/components/prefabs/tpk-forgot-password';
import AuthLayout from '../auth-layout.gts';
import { createForgotPasswordValidationSchema } from './forgot-password-validation.ts';
import { service } from '@ember/service';
import { t, type IntlService } from 'ember-intl';
import type RouterService from '@ember/routing/router-service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';

export default class ForgotPasswordForm extends Component {
  @service declare intl: IntlService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;

  get forgotPasswordValidationSchema(): ReturnType<
    typeof createForgotPasswordValidationSchema
  > {
    return createForgotPasswordValidationSchema(this.intl);
  }

  onSubmit = async (data: { email: string }) => {
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      this.flashMessages.success(
        this.intl.t('auth.forms.forgotPassword.messages.checkEmail')
      );
      this.router.transitionTo('login');
    } catch {
      this.flashMessages.danger(
        this.intl.t('auth.forms.forgotPassword.messages.error')
      );
    }
  };

  <template>
    <AuthLayout>
      <h1>{{t "auth.forms.forgotPassword.title"}}</h1>
      <TpkForgotPasswordForm
        @onSubmit={{this.onSubmit}}
        @forgotPasswordSchema={{this.forgotPasswordValidationSchema}}
        class="tpk-login-form"
      />
      <LinkTo @route="login" class="login-link">{{t
          "auth.forms.forgotPassword.actions.backToLogin"
        }}</LinkTo>
    </AuthLayout>
  </template>
}
