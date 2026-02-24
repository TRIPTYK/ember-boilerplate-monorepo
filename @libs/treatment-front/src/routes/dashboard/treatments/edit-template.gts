import { TreatmentChangeset } from '#src/changesets/treatment.ts';
import TreatmentForm from '#src/components/forms/treatment-form.gts';
import SuccessScreen from '#src/components/views/success-screen.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

  @tracked showSuccessScreen = false;

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
    this.showSuccessScreen = true;
  };

  handleCreateNewFlow = () => {
    this.router.transitionTo('dashboard.treatments.create');
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
