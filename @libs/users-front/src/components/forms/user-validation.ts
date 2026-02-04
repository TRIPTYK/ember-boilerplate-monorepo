import { email, object, string } from 'zod';
import type z from 'zod';
import type { IntlService } from 'ember-intl';

export const createUserValidationSchema = (intl: IntlService) =>
  object({
    firstName: string().min(
      1,
      intl.t('users.forms.user.validation.firstNameRequired'),
    ),
    lastName: string().min(
      1,
      intl.t('users.forms.user.validation.lastNameRequired'),
    ),
    email: email(intl.t('users.forms.user.validation.invalidEmail')),
    id: string().optional().nullable(),
  });

export type ValidatedUser = z.infer<
  ReturnType<typeof createUserValidationSchema>
>;
