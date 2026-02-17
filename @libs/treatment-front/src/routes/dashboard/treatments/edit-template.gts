import { treatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentsForm from '#src/components/forms/treatment-form.gts';
import Component from '@glimmer/component';
import type { treatmentsEditRouteSignature } from './edit.gts';
import { editTreatmentValidationSchema } from '#src/components/forms/treatment-validation.ts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type Owner from '@ember/owner';

export default class treatmentsEditRouteTemplate extends Component<treatmentsEditRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof editTreatmentValidationSchema>;

  constructor(owner: Owner, args: treatmentsEditRouteSignature) {
    super(owner, args);
    this.validationSchema = editTreatmentValidationSchema(this.intl);
  }

  changeset = new treatmentChangeset({
    id: this.args.model.treatment.id,
    title: this.args.model.treatment.title,
    description: this.args.model.treatment.description,
  });

  <template>
    <TreatmentsForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
