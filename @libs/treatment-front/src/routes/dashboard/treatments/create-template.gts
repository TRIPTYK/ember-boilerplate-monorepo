import { TreatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentForm from '#src/components/forms/treatment-form.gts';
import SuccessScreen from '#src/components/views/success-screen.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

  @tracked changeset = new TreatmentChangeset({});
  @tracked showSuccessScreen = false;

  constructor(owner: Owner, args: treatmentsCreateRouteSignature) {
    super(owner, args);
  }

  handleSaveDraft = async (data: DraftTreatmentData) => {
    await this.treatment.save(data);
  };

  handleFinish = async (data: TreatmentData) => {
    await this.treatment.save(data);
    this.showSuccessScreen = true;
  };

  handleCreateNewFlow = () => {
    this.changeset = new TreatmentChangeset({});
    this.showSuccessScreen = false;
  };

  handleGoToList = () => {
    this.router.transitionTo('dashboard.treatments');
  };

  handleCancel = () => {
    this.router.transitionTo('dashboard.treatments');
  };

  <template>
    {{#if this.showSuccessScreen}}
      <SuccessScreen
        @onCreateNewFlow={{this.handleCreateNewFlow}}
        @onFinish={{this.handleGoToList}}
      />
    {{else}}
      <TreatmentForm
        @changeset={{this.changeset}}
        @onSave={{this.handleSaveDraft}}
        @onFinish={{this.handleFinish}}
        @onCancel={{this.handleCancel}}
      />
    {{/if}}
  </template>
}
