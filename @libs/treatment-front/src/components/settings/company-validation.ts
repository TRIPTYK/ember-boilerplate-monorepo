import { object, string, boolean, email } from 'zod';
import type { IntlService } from 'ember-intl';

const requiredAddressSchema = (intl: IntlService) =>
  object({
    streetAndNumber: string(intl.t('settings.company.validation.required')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
    postalCode: string(intl.t('settings.company.validation.required')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
    city: string(intl.t('settings.company.validation.required')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
    country: string(intl.t('settings.company.validation.required')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
    phone: string(intl.t('settings.company.validation.required')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
    email: email(intl.t('settings.company.validation.emailInvalid')).min(
      1,
      intl.t('settings.company.validation.required')
    ),
  });

const draftAddressSchema = object({
  streetAndNumber: string().optional(),
  postalCode: string().optional(),
  city: string().optional(),
  country: string().optional(),
  phone: string().optional(),
  email: string().optional(),
});

export const companySchema = (intl: IntlService) =>
  object({
    responsible: object({
      fullName: string(intl.t('settings.company.validation.required')).min(
        1,
        intl.t('settings.company.validation.required')
      ),
      entityNumber: string().optional(),
      address: requiredAddressSchema(intl),
    }),
    hasDPO: boolean().optional(),
    DPO: object({
      fullName: string().optional(),
      address: draftAddressSchema.optional(),
    }).optional(),
    hasExternalDPO: boolean().optional(),
    externalOrganizationDPO: object({
      fullName: string().optional(),
      entityNumber: string().optional(),
      address: draftAddressSchema.optional(),
    }).optional(),
  }).superRefine((data, ctx) => {
    const required = intl.t('settings.company.validation.required');

    if (data.hasDPO && !data.DPO?.fullName) {
      ctx.addIssue({
        code: 'custom',
        path: ['DPO', 'fullName'],
        message: required,
      });
    }

    if (data.hasExternalDPO && !data.externalOrganizationDPO?.fullName) {
      ctx.addIssue({
        code: 'custom',
        path: ['externalOrganizationDPO', 'fullName'],
        message: required,
      });
    }
  });
