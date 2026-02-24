import { TreatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentForm from '#src/components/forms/treatment-form.gts';
import Component from '@glimmer/component';
import type { treatmentsEditRouteSignature } from './edit.gts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type Owner from '@ember/owner';
import type RouterService from '@ember/routing/router-service';
import type TreatmentService from '#src/services/treatment.ts';
import type {
  DraftTreatmentData,
  TreatmentData,
} from '#src/components/forms/treatment-validation.ts';

export default class treatmentsEditRouteTemplate extends Component<treatmentsEditRouteSignature> {
  @service declare intl: IntlService;
  @service declare router: RouterService;
  @service declare treatment: TreatmentService;

  constructor(owner: Owner, args: treatmentsEditRouteSignature) {
    super(owner, args);
  }

  changeset = new TreatmentChangeset({
    id: this.args.model.treatment.id,
    ...(this.args.model.treatment.data || {}),
  });

  handleSaveDraft = async (data: DraftTreatmentData) => {
    await this.treatment.save({
      id: this.args.model.treatment.id,
      ...data,
    });
  };

  handleFinish = async (data: TreatmentData) => {
    await this.treatment.save({
      id: this.args.model.treatment.id,
      ...data,
    });
    this.router.transitionTo('dashboard.treatments');
  };

  handleCancel = () => {
    this.router.transitionTo('dashboard.treatments');
  };

  <template>
    <TreatmentForm
      @changeset={{this.changeset}}
      @onSave={{this.handleSaveDraft}}
      @onFinish={{this.handleFinish}}
      @onCancel={{this.handleCancel}}
    />
  </template>
}
