import {
  object,
  string,
  boolean,
  array,
  literal,
  union,
  type z,
  email,
} from 'zod';
import type { IntlService } from 'ember-intl';

export const treatmentStatusSchema = union([
  literal('draft'),
  literal('validated'),
  literal('archived'),
]);

export type TreatmentStatus = z.infer<typeof treatmentStatusSchema>;

export const addressSchema = object({
  streetAndNumber: string().min(1),
  postalCode: string().min(1),
  city: string().min(1),
  country: string().min(1),
  phone: string().min(1),
  email: email().min(1),
});

export const draftAddressSchema = object({
  streetAndNumber: string().optional(),
  postalCode: string().optional(),
  city: string().optional(),
  country: string().optional(),
  phone: string().optional(),
  email: string().optional(),
});

export const contactInfoSchema = object({
  fullName: string().min(1),
  entityNumber: string().optional(),
  address: addressSchema,
});

export const draftContactInfoSchema = object({
  fullName: string().optional(),
  entityNumber: string().optional(),
  address: draftAddressSchema.optional(),
});

export const draftDPOContactInfoSchema = object({
  fullName: string().optional(),
  address: draftAddressSchema.optional(),
});

export const dataWithInfoSchema = object({
  name: string().min(1),
  additionalInformation: string().optional(),
});

export const draftDataWithInfoSchema = object({
  name: string().optional(),
  additionalInformation: string().optional(),
});

export const recipientSchema = object({
  fullName: string().min(1),
  country: string().min(1),
  guaranteeTypes: string().min(1),
  linkToDoc: string().optional(),
});

export const draftRecipientSchema = object({
  fullName: string().optional(),
  country: string().optional(),
  guaranteeTypes: string().optional(),
  linkToDoc: string().optional(),
});

export const legalBaseSchema = object({
  name: string().min(1),
  additionalInformation: string().optional(),
});

export const draftLegalBaseSchema = object({
  name: string().optional(),
  additionalInformation: string().optional(),
});

export const treatmentSchema = object({
  id: string().optional().nullable(),
  dueDateForUpdate: string().optional().nullable(),
  title: string().min(1),
  description: string().optional(),
  treatmentType: string().optional(),
  responsible: contactInfoSchema,
  hasDPO: boolean().optional(),
  DPO: draftDPOContactInfoSchema.optional(),
  hasExternalDPO: boolean().optional(),
  externalOrganizationDPO: draftContactInfoSchema.optional(),
  reasons: array(string()).optional(),
  subReasons: array(draftDataWithInfoSchema).optional(),
  legalBase: array(draftLegalBaseSchema).optional(),
  dataSubjectCategories: array(string()).optional(),
  subjectCategoryPrecisions: array(draftDataWithInfoSchema).optional(),
  personalDataGroup: object({
    data: object({ name: array(object({ name: string().min(1), isSensitive: boolean() })).optional() }),
    conservationDuration: string().optional(),
  }).optional(),
  financialDataGroup: object({
    data: object({ name: array(object({ name: string().min(1), isSensitive: boolean() })).optional() }),
    conservationDuration: string().optional(),
  }).optional(),
  dataSources: array(object({ name: string().min(1), additionalInformation: string().optional() })).optional(),
  dataAccess: array(draftDataWithInfoSchema).optional(),
  sharedData: array(draftDataWithInfoSchema).optional(),
  retentionPeriod: string().optional(),
  hasAccessByThirdParty: boolean().optional(),
  thirdPartyAccess: array(string()).optional(),
  areDataExportedOutsideEU: boolean().optional(),
  recipient: draftRecipientSchema.optional(),
  securityMeasures: array(string()).optional(),
  securitySetup: array(draftDataWithInfoSchema).optional(),
});

export const draftTreatmentSchema = object({
  id: string().optional().nullable(),
  dueDateForUpdate: string().optional().nullable(),
  title: string().optional(),
  description: string().optional(),
  treatmentType: string().optional(),
  responsible: draftContactInfoSchema.optional(),
  hasDPO: boolean().optional(),
  DPO: draftDPOContactInfoSchema.optional(),
  hasExternalDPO: boolean().optional(),
  externalOrganizationDPO: draftContactInfoSchema.optional(),
  reasons: array(string()).optional(),
  subReasons: array(draftDataWithInfoSchema).optional(),
  legalBase: array(draftLegalBaseSchema).optional(),
  dataSubjectCategories: array(string()).optional(),
  subjectCategoryPrecisions: array(draftDataWithInfoSchema).optional(),
  personalDataGroup: object({
    data: object({ name: array(object({ name: string().optional(), isSensitive: boolean().optional() })).optional() }),
    conservationDuration: string().optional(),
  }).optional(),
  financialDataGroup: object({
    data: object({ name: array(object({ name: string().optional(), isSensitive: boolean().optional() })).optional() }),
    conservationDuration: string().optional(),
  }).optional(),
  dataSources: array(object({ name: string().optional(), additionalInformation: string().optional() })).optional(),
  dataAccess: array(draftDataWithInfoSchema).optional(),
  sharedData: array(draftDataWithInfoSchema).optional(),
  retentionPeriod: string().optional(),
  hasAccessByThirdParty: boolean().optional(),
  thirdPartyAccess: array(string()).optional(),
  areDataExportedOutsideEU: boolean().optional(),
  recipient: draftRecipientSchema.optional(),
  securityMeasures: array(string()).optional(),
  securitySetup: array(draftDataWithInfoSchema).optional(),
});

export const treatmentResponseSchema = object({
  id: string(),
  creationDate: string(),
  updateDate: string().optional(),
  dueDateForUpdate: string().optional().nullable(),
  status: treatmentStatusSchema,
  order: string().optional(),
  isOverDueDate: boolean().optional(),
  data: draftTreatmentSchema,
});

export const draftTreatmentResponseSchema = object({
  id: string(),
  creationDate: string(),
  updateDate: string().optional(),
  dueDateForUpdate: string().optional().nullable(),
  status: treatmentStatusSchema,
  order: string().optional(),
  isOverDueDate: boolean().optional(),
  data: draftTreatmentSchema,
});

export type TreatmentData = Omit<
  z.infer<typeof treatmentSchema>,
  'id' | 'dueDateForUpdate'
>;

export type DraftTreatmentData = Omit<
  z.infer<typeof draftTreatmentSchema>,
  'id' | 'dueDateForUpdate'
>;

export const step1Schema = (intl: IntlService) =>
  object({
    title: string(intl.t('treatments.form.step1.validation.titleRequired')).min(
      1,
      intl.t('treatments.form.step1.validation.titleRequired')
    ),
    description: string().optional(),
    treatmentType: string().optional(),
  });

export const step2Schema = (intl: IntlService) =>
  object({
    responsible: object({
      fullName: string(
        intl.t('treatments.form.step2.validation.responsibleNameRequired')
      ).min(
        1,
        intl.t('treatments.form.step2.validation.responsibleNameRequired')
      ),
      entityNumber: string().optional(),
      address: object({
        streetAndNumber: string(
          intl.t('treatments.form.step2.validation.addressRequired')
        ).min(1, intl.t('treatments.form.step2.validation.addressRequired')),
        postalCode: string(
          intl.t('treatments.form.step2.validation.postalCodeRequired')
        ).min(1, intl.t('treatments.form.step2.validation.postalCodeRequired')),
        city: string(
          intl.t('treatments.form.step2.validation.cityRequired')
        ).min(1, intl.t('treatments.form.step2.validation.cityRequired')),
        country: string(
          intl.t('treatments.form.step2.validation.countryRequired')
        ).min(1, intl.t('treatments.form.step2.validation.countryRequired')),
        phone: string(
          intl.t('treatments.form.step2.validation.phoneRequired')
        ).min(1, intl.t('treatments.form.step2.validation.phoneRequired')),
        email: string(intl.t('treatments.form.step2.validation.emailRequired'))
          .email(intl.t('treatments.form.step2.validation.emailInvalid'))
          .min(1, intl.t('treatments.form.step2.validation.emailRequired')),
      }),
    }),
    hasDPO: boolean().optional(),
    DPO: draftDPOContactInfoSchema.optional(),
    hasExternalDPO: boolean().optional(),
    externalOrganizationDPO: draftContactInfoSchema.optional(),
  });

export const step3Schema = () =>
  object({
    reasons: array(string()).optional(),
    subReasons: array(draftDataWithInfoSchema).optional(),
  });

export const step4Schema = () =>
  object({
    dataSubjectCategories: array(string()).optional(),
    subjectCategoryPrecisions: array(draftDataWithInfoSchema).optional(),
  });

export const step5Schema = () =>
  object({
    personalDataGroup: object({
      data: object({ name: array(object({ name: string().optional(), isSensitive: boolean().optional() })).optional() }),
      conservationDuration: string().optional(),
    }).optional(),
    financialDataGroup: object({
      data: object({ name: array(object({ name: string().optional(), isSensitive: boolean().optional() })).optional() }),
      conservationDuration: string().optional(),
    }).optional(),
    dataSources: array(object({ name: string().optional(), additionalInformation: string().optional() })).optional(),
  });

export const step6Schema = () =>
  object({
    legalBase: array(draftLegalBaseSchema).optional(),
  });

export const step7Schema = () =>
  object({
    dataAccess: array(draftDataWithInfoSchema).optional(),
    sharedData: array(draftDataWithInfoSchema).optional(),
    areDataExportedOutsideEU: boolean().optional(),
    recipient: draftRecipientSchema.optional(),
  }).superRefine((data, ctx) => {
    if (data.areDataExportedOutsideEU) {
      if (!data.recipient?.fullName) {
        ctx.addIssue({ code: 'custom', path: ['recipient', 'fullName'], message: 'required' });
      }
      if (!data.recipient?.country) {
        ctx.addIssue({ code: 'custom', path: ['recipient', 'country'], message: 'required' });
      }
      if (!data.recipient?.guaranteeTypes) {
        ctx.addIssue({ code: 'custom', path: ['recipient', 'guaranteeTypes'], message: 'required' });
      }
    }
  });

export const step8Schema = () =>
  object({
    securitySetup: array(draftDataWithInfoSchema).optional(),
  });

export const createTreatmentValidationSchema = step1Schema;
export const editTreatmentValidationSchema = step1Schema;

export type ValidatedTreatment = TreatmentData;
export type UpdatedTreatment = TreatmentData;
