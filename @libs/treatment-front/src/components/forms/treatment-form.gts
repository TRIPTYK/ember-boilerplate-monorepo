import Component from '@glimmer/component';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type TreatmentService from '#src/services/treatment.ts';
import type { treatmentChangeset } from '#src/changesets/treatment.ts';
import {
  createTreatmentValidationSchema,
  editTreatmentValidationSchema,
  type UpdatedTreatment,
  type ValidatedTreatment,
} from '#src/components/forms/treatment-validation.ts';
import type RouterService from '@ember/routing/router-service';
import { create, fillable, clickable } from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';
import { LinkTo } from '@ember/routing';
import type ImmerChangeset from 'ember-immer-changeset';
import HandleSaveService from '@libs/shared-front/services/handle-save';

interface treatmentsFormArgs {
  changeset: treatmentChangeset;
  validationSchema:
    | ReturnType<typeof createTreatmentValidationSchema>
    | ReturnType<typeof editTreatmentValidationSchema>;
}

export default class treatmentsForm extends Component<treatmentsFormArgs> {
  @service declare treatment: TreatmentService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare handleSave: HandleSaveService;

  onSubmit = async (
    data: ValidatedTreatment | UpdatedTreatment,
    c: ImmerChangeset<ValidatedTreatment | UpdatedTreatment>
  ) => {
    await this.handleSave.handleSave({
      saveAction: () => this.treatment.save(data),
      changeset: c,
      successMessage: 'treatments.forms.treatment.messages.saveSuccess',
      transitionOnSuccess: 'dashboard.treatments',
    });
  };

  tpkButton = () => {};

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{@validationSchema}}
      data-test-treatments-form
      as |F|
    >
      <div class="grid grid-cols-12 gap-x-6 gap-y-3 max-w-4xl">
        <F.TpkInputPrefab
          @label={{t "treatments.forms.treatment.labels.title"}}
          @validationField="title"
          class="col-span-12 md:col-span-4"
        />
        <F.TpkTextareaPrefab
          @label={{t "treatments.forms.treatment.labels.description"}}
          @validationField="description"
          class="col-span-12 md:col-span-5"
        />
        <div class="col-span-12 flex items-center justify-between gap-2">
          <button type="submit" class="btn btn-primary">
            {{t "treatments.forms.treatment.actions.submit"}}
          </button>
          <LinkTo
            @route="dashboard.treatments"
            class="text-sm text-primary underline text-center mt-2"
          >
            {{t "treatments.forms.treatment.actions.back"}}
          </LinkTo>
        </div>
      </div>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-treatments-form]',
  title: fillable('[data-test-tpk-prefab-input-container="title"] input'),
  description: fillable(
    '[data-test-tpk-prefab-textarea-container="description"] textarea'
  ),
  completed: clickable(
    '[data-test-tpk-prefab-checkbox-container="completed"] input'
  ),
  submit: clickable('button[type="submit"]'),
});
