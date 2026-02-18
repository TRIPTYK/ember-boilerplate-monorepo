import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import type RouterService from '@ember/routing/router-service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';
import type { treatmentChangeset } from '#src/changesets/treatment.ts';
import {
  step1Schema,
  step2Schema,
  type DraftTreatmentData,
  type TreatmentData,
} from '#src/components/forms/treatment-validation.ts';
import Step1Name from './step-1-name.gts';
import Step2GeneralInfo from './step-2-general-info.gts';

interface TreatmentWizardSignature {
  Args: {
    changeset: treatmentChangeset;
    onSave?: (data: DraftTreatmentData) => Promise<void>;
    onFinish: (data: TreatmentData) => Promise<void>;
    onCancel: () => void;
  };
}

export default class TreatmentWizard extends Component<TreatmentWizardSignature> {
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  @tracked currentStep = 1;
  @tracked isValidating = false;
  @tracked isSaving = false;

  get step1ValidationSchema() {
    return step1Schema(this.intl);
  }

  get step2ValidationSchema() {
    return step2Schema(this.intl);
  }

  get currentValidationSchema() {
    return this.currentStep === 1
      ? this.step1ValidationSchema
      : this.step2ValidationSchema;
  }

  get isStep1() {
    return this.currentStep === 1;
  }

  get isStep2() {
    return this.currentStep === 2;
  }

  get canGoNext() {
    return this.currentStep < 2;
  }

  get canGoPrevious() {
    return this.currentStep > 1;
  }

  get isStepCompleted() {
    return (step: number) => this.currentStep > step;
  }

  get isCurrentStep() {
    return (step: number) => this.currentStep === step;
  }

  @action
  async validateCurrentStep(): Promise<boolean> {
    this.isValidating = true;
    try {
      const data = this.args.changeset.data;

      if (this.currentStep === 1) {
        await this.step1ValidationSchema.parseAsync({
          title: data.title,
          description: data.description,
          treatmentType: data.treatmentType,
        });
      } else if (this.currentStep === 2) {
        await this.step2ValidationSchema.parseAsync({
          responsible: data.responsible,
          hasDPO: data.hasDPO,
          DPO: data.DPO,
          hasExternalDPO: data.hasExternalDPO,
          externalOrganizationDPO: data.externalOrganizationDPO,
        });
      }

      return true;
    } catch {
      this.flashMessages.danger(
        this.intl.t('treatments.wizard.validation.stepInvalid')
      );
      return false;
    } finally {
      this.isValidating = false;
    }
  }

  @action
  async goToNextStep() {
    const isValid = await this.validateCurrentStep();
    if (isValid && this.canGoNext) {
      this.currentStep++;
    }
  }

  @action
  goToPreviousStep() {
    if (this.canGoPrevious) {
      this.currentStep--;
    }
  }

  @action
  async handleSaveDraft() {
    if (this.args.onSave) {
      this.isSaving = true;
      try {
        const data = this.args.changeset.data as DraftTreatmentData;
        await this.args.onSave(data);
        this.flashMessages.success(
          this.intl.t('treatments.wizard.messages.draftSaved')
        );
      } catch {
        this.flashMessages.danger(
          this.intl.t('treatments.wizard.messages.saveFailed')
        );
      } finally {
        this.isSaving = false;
      }
    }
  }

  @action
  skipStep() {
    if (this.canGoNext) {
      this.currentStep++;
    }
  }

  @action
  async handleFinish() {
    const isValid = await this.validateCurrentStep();
    if (!isValid) {
      return;
    }

    this.isSaving = true;
    try {
      const data = this.args.changeset.data as TreatmentData;
      await this.args.onFinish(data);
      this.flashMessages.success(
        this.intl.t('treatments.wizard.messages.treatmentCreated')
      );
    } catch {
      this.flashMessages.danger(
        this.intl.t('treatments.wizard.messages.saveFailed')
      );
    } finally {
      this.isSaving = false;
    }
  }

  @action
  handleCancel() {
    this.args.onCancel();
  }

  <template>
    <div class="max-w-7xl mx-auto px-4 py-8">
      {{! Progress Indicator }}
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center gap-4">
          {{! Step 1 }}
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full border-2
                {{if
                  this.isStep1
                  'border-blue-500 bg-blue-500 text-white'
                  (if
                    (this.isStepCompleted 1)
                    'border-blue-500 bg-blue-500 text-white'
                    'border-gray-300 text-gray-500'
                  )
                }}"
            >
              {{#if (this.isStepCompleted 1)}}
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              {{else}}
                1
              {{/if}}
            </div>
            <span class="ml-2 text-sm font-medium">
              {{t "treatments.wizard.progress.step1"}}
            </span>
          </div>

          {{! Connector }}
          <div
            class="w-16 h-0.5
              {{if
                (this.isStepCompleted 1)
                'bg-blue-500'
                'bg-gray-300'
              }}"
          ></div>

          {{! Step 2 }}
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full border-2
                {{if
                  this.isStep2
                  'border-blue-500 bg-blue-500 text-white'
                  'border-gray-300 text-gray-500'
                }}"
            >
              2
            </div>
            <span class="ml-2 text-sm font-medium">
              {{t "treatments.wizard.progress.step2"}}
            </span>
          </div>
        </div>
      </div>

      {{! Form Content }}
      <TpkForm
      {{! @glint-expect-error: Changeset type mismatch with TpkForm generic }}
        @changeset={{@changeset}}
        @validationSchema={{this.currentValidationSchema}}
        @onSubmit={{if this.isStep2 this.handleFinish this.goToNextStep}}
        as |F|
      >
        <div class="bg-white rounded-lg shadow-lg p-8">
          {{#if this.isStep1}}
            <Step1Name @form={{F}} />
          {{else if this.isStep2}}
            <Step2GeneralInfo @form={{F}} @changeset={{@changeset}} />
          {{/if}}

          {{! Navigation Buttons }}
          <div class="flex items-center justify-between mt-8 pt-6 border-t">
            <div class="flex gap-3">
              {{#if this.isStep1}}
                <button
                  type="button"
                  {{on "click" this.handleCancel}}
                  class="btn btn-outline btn-primary"
                  disabled={{this.isSaving}}
                >
                  {{t "treatments.wizard.navigation.cancel"}}
                </button>
              {{else}}
                <button
                  type="button"
                  {{on "click" this.goToPreviousStep}}
                  class="btn btn-outline btn-primary"
                  disabled={{this.isSaving}}
                >
                  {{t "treatments.wizard.navigation.previous"}}
                </button>
              {{/if}}

              {{#if this.isStep2}}
                <button
                  type="button"
                  {{on "click" this.handleSaveDraft}}
                  class="btn btn-outline btn-primary"
                  disabled={{this.isSaving}}
                >
                  {{t "treatments.wizard.navigation.save"}}
                </button>

                <button
                  type="button"
                  {{on "click" this.skipStep}}
                  class="btn btn-outline btn-primary"
                  disabled={{this.isSaving}}
                >
                  {{t "treatments.wizard.navigation.skip"}}
                </button>
              {{/if}}
            </div>

            <div>
              {{#if this.isStep1}}
                <button
                  type="submit"
                  class="btn btn-warning"
                  disabled={{this.isValidating}}
                >
                  {{t "treatments.wizard.navigation.start"}}
                </button>
              {{else}}
                <button
                  type="submit"
                  class="btn btn-warning"
                  disabled={{this.isSaving}}
                >
                  {{t "treatments.wizard.navigation.finish"}}
                </button>
              {{/if}}
            </div>
          </div>
        </div>
      </TpkForm>
    </div>
  </template>
}
