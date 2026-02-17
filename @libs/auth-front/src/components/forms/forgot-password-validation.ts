import { email, object } from 'zod';
import type { IntlService } from 'ember-intl';

export const createForgotPasswordValidationSchema = (intl: IntlService) =>
  object({
    email: email(intl.t('auth.forms.forgotPassword.validation.invalidEmail')),
  });

export default createForgotPasswordValidationSchema;
