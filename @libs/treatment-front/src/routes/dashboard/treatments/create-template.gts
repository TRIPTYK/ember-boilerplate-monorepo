import { treatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentsForm from '#src/components/forms/treatment-form.gts';
import Component from '@glimmer/component';
import type { treatmentsCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import { createTreatmentValidationSchema } from '#src/components/forms/treatment-validation.ts';

export default class treatmentsCreateRouteTemplate extends Component<treatmentsCreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof createTreatmentValidationSchema>;
  changeset = new treatmentChangeset({});

  constructor(owner: Owner, args: treatmentsCreateRouteSignature) {
    super(owner, args);
    this.validationSchema = createTreatmentValidationSchema(this.intl);
  }

  <template>
    <TreatmentsForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
