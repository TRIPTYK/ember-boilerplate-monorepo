import { email, object } from 'zod';
import type { IntlService } from 'ember-intl';

export const createLoginValidationSchema = (intl: IntlService) =>
  object({
    email: email(intl.t('users.forms.forgotPassword.validation.invalidEmail')),
  });

export default createLoginValidationSchema;
