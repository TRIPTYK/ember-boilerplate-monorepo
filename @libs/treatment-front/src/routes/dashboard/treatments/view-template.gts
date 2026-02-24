import TreatmentView from '#src/components/views/treatment-view.gts';
import Component from '@glimmer/component';
import type { TreatmentsViewRouteSignature } from './view.gts';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class TreatmentsViewRouteTemplate extends Component<TreatmentsViewRouteSignature> {
  @service declare router: RouterService;

  handleBack = () => {
    this.router.transitionTo('dashboard.treatments');
  };

  handleEdit = () => {
    this.router.transitionTo(
      'dashboard.treatments.edit',
      this.args.model.treatment.id
    );
  };

  <template>
    <TreatmentView
      @treatment={{@model.treatment}}
      @onBack={{this.handleBack}}
      @onEdit={{this.handleEdit}}
    />
  </template>
}
