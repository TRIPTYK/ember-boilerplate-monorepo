import { email, object, string } from 'zod';
import type { IntlService } from 'ember-intl';

export const createLoginValidationSchema = (intl: IntlService) =>
  object({
    email: email(intl.t('auth.forms.login.validation.invalidEmail')),
    password: string().min(
      8,
      intl.t('auth.forms.login.validation.passwordTooShort')
    ),
  });

const LoginValidationSchema = object({
  email: email('Please enter a valid email address'),
  password: string().min(8, 'Password must be at least 8 characters'),
});

export default LoginValidationSchema;
