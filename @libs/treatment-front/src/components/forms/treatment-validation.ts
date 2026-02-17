import { object, string } from 'zod';
import type z from 'zod';
import type { IntlService } from 'ember-intl';

export const createTreatmentValidationSchema = (intl: IntlService) =>
  object({
    title: string(
      intl.t('treatments.forms.treatment.validation.titleRequired')
    ).min(1, intl.t('treatments.forms.treatment.validation.titleRequired')),
    description: string(
      intl.t('treatments.forms.treatment.validation.descriptionRequired')
    ).min(
      1,
      intl.t('treatments.forms.treatment.validation.descriptionRequired')
    ),
    id: string().optional().nullable(),
  });

export const editTreatmentValidationSchema = (intl: IntlService) =>
  object({
    title: string(
      intl.t('treatments.forms.treatment.validation.titleRequired')
    ).min(1, intl.t('treatments.forms.treatment.validation.titleRequired')),
    description: string(
      intl.t('treatments.forms.treatment.validation.descriptionRequired')
    ).min(
      1,
      intl.t('treatments.forms.treatment.validation.descriptionRequired')
    ),
    id: string(),
  });

export type ValidatedTreatment = z.infer<
  ReturnType<typeof createTreatmentValidationSchema>
>;

export type UpdatedTreatment = z.infer<
  ReturnType<typeof editTreatmentValidationSchema>
>;
