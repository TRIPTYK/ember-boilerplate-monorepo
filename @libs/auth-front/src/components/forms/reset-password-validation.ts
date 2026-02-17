import { object, string } from 'zod';
import type { IntlService } from 'ember-intl';

export const createResetPasswordValidationSchema = (intl: IntlService) =>
  object({
    password: string()
      .min(8, intl.t('auth.forms.resetPassword.validation.passwordTooShort'))
      .regex(
        /[A-Z]/,
        intl.t('auth.forms.resetPassword.validation.passwordUppercase')
      )
      .regex(
        /[0-9]/,
        intl.t('auth.forms.resetPassword.validation.passwordNumber')
      ),
    confirmPassword: string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: intl.t('auth.forms.resetPassword.validation.passwordsDontMatch'),
    path: ['confirmPassword'],
  });

export default createResetPasswordValidationSchema;
