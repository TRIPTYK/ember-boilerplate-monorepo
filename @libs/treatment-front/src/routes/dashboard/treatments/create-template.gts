import { treatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentWizard from '#src/components/wizard/treatment-wizard.gts';
import Component from '@glimmer/component';
import type { treatmentsCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type TreatmentService from '#src/services/treatment.ts';
import type {
  DraftTreatmentData,
  TreatmentData,
} from '#src/components/forms/treatment-validation.ts';

export default class treatmentsCreateRouteTemplate extends Component<treatmentsCreateRouteSignature> {
  @service declare intl: IntlService;
  @service declare router: RouterService;
  @service declare treatment: TreatmentService;

  changeset = new treatmentChangeset({});

  constructor(owner: Owner, args: treatmentsCreateRouteSignature) {
    super(owner, args);
  }

  handleSaveDraft = async (data: DraftTreatmentData) => {
    await this.treatment.save(data as any);
  };

  handleFinish = async (data: TreatmentData) => {
    await this.treatment.save(data as any);
    this.router.transitionTo('dashboard.treatments');
  };

  handleCancel = () => {
    this.router.transitionTo('dashboard.treatments');
  };

  <template>
    <TreatmentWizard
      @changeset={{this.changeset}}
      @onSave={{this.handleSaveDraft}}
      @onFinish={{this.handleFinish}}
      @onCancel={{this.handleCancel}}
    />
  </template>
}
