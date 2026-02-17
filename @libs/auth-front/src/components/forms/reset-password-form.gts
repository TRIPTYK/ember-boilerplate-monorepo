import Component from '@glimmer/component';
import { service } from '@ember/service';
import { createResetPasswordValidationSchema } from './reset-password-validation.ts';
import type z from 'zod';
import TpkResetPasswordForm from '@triptyk/ember-ui/components/prefabs/tpk-reset-password';
import { t } from 'ember-intl';
import type { IntlService } from 'ember-intl';
import AuthLayout from '../auth-layout.gts';
import type RouterService from '@ember/routing/router-service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { LinkTo } from '@ember/routing';

interface ResetPasswordFormArgs {
  token: string;
}

export default class ResetPasswordForm extends Component<ResetPasswordFormArgs> {
  @service declare intl: IntlService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;

  get resetPasswordValidationSchema(): ReturnType<
    typeof createResetPasswordValidationSchema
  > {
    return createResetPasswordValidationSchema(this.intl);
  }

  onSubmit = async (
    data: z.infer<ReturnType<typeof createResetPasswordValidationSchema>>
  ) => {
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.args.token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Reset failed');
      }

      this.flashMessages.success(
        this.intl.t('auth.forms.resetPassword.messages.success')
      );
      this.router.transitionTo('login');
    } catch {
      this.flashMessages.danger(
        this.intl.t('auth.forms.resetPassword.messages.invalidToken')
      );
    }
  };

  <template>
    <AuthLayout data-test-reset-password-form>
      <h1>{{t "auth.forms.resetPassword.title"}}</h1>
      <TpkResetPasswordForm
        @onSubmit={{this.onSubmit}}
        @resetPasswordSchema={{this.resetPasswordValidationSchema}}
        class="tpk-reset-password-form"
      />
      <LinkTo @route="login" class="login-link">{{t
          "auth.forms.forgotPassword.actions.backToLogin"
        }}</LinkTo>
    </AuthLayout>
  </template>
}
