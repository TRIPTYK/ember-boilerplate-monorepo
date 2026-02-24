import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import type RouterService from '@ember/routing/router-service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { type IntlService } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  type DraftTreatmentData,
  type TreatmentData,
} from '#src/components/forms/treatment-validation.ts';
import Step1Name from './treatment-form/step-1-name.gts';
import Step2GeneralInfo from './treatment-form/step-2-general-info.gts';
import Step3Purposes from './treatment-form/step-3-purposes.gts';
import Step4Categories from './treatment-form/step-4-categories.gts';
import Step5Data from './treatment-form/step-5-data.gts';
import Step6LegalBasis from './treatment-form/step-6-legal-basis.gts';
import Step7DataSharing from './treatment-form/step-7-data-sharing.gts';
import Step8Security from './treatment-form/step-8-security.gts';
import FormSteps, {
  type FormStep,
  type StepStatus,
} from '#src/components/ui/form-steps.gts';
import FormNavigation from '#src/components/ui/form-navigation.gts';

interface TreatmentFormSignature {
  Args: {
    changeset: TreatmentChangeset;
    onSave?: (data: DraftTreatmentData) => Promise<void>;
    onFinish: (data: TreatmentData) => Promise<void>;
    onCancel: () => void;
  };
}

export default class TreatmentForm extends Component<TreatmentFormSignature> {
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  @tracked currentStep = 1;

  constructor(owner: Owner, args: TreatmentFormSignature['Args']) {
    super(owner, args);
    const stepFromQP = Number(
      new URLSearchParams(window.location.search).get('step')
    );
    if (stepFromQP >= 1 && stepFromQP <= 8) {
      this.currentStep = stepFromQP;
    }
  }

  private syncStepToUrl(step: number) {
    this.currentStep = step;
    const url = new URL(window.location.href);
    url.searchParams.set('step', step.toString());
    window.history.replaceState(null, '', url.toString());
  }

  @tracked isValidating = false;
  @tracked isSaving = false;
  @tracked stepErrors: Partial<Record<number, boolean>> = {};

  getStepStatus = (step: number): StepStatus => {
    if (this.currentStep === step) return 'current';
    if (this.stepErrors[step]) return 'error';
    if (this.currentStep > step) return 'done';
    return 'pending';
  };

  get steps(): FormStep[] {
    return [
      {
        number: 1,
        label: this.intl.t('treatments.form.progress.step1'),
        status: this.getStepStatus(1),
      },
      {
        number: 2,
        label: this.intl.t('treatments.form.progress.step2'),
        status: this.getStepStatus(2),
      },
      {
        number: 3,
        label: this.intl.t('treatments.form.progress.step3'),
        status: this.getStepStatus(3),
      },
      {
        number: 4,
        label: this.intl.t('treatments.form.progress.step4'),
        status: this.getStepStatus(4),
      },
      {
        number: 5,
        label: this.intl.t('treatments.form.progress.step5'),
        status: this.getStepStatus(5),
      },
      {
        number: 6,
        label: this.intl.t('treatments.form.progress.step6'),
        status: this.getStepStatus(6),
      },
      {
        number: 7,
        label: this.intl.t('treatments.form.progress.step7'),
        status: this.getStepStatus(7),
      },
      {
        number: 8,
        label: this.intl.t('treatments.form.progress.step8'),
        status: this.getStepStatus(8),
      },
    ];
  }

  get step1ValidationSchema() {
    return step1Schema(this.intl);
  }

  get step2ValidationSchema() {
    return step2Schema(this.intl);
  }

  get step3ValidationSchema() {
    return step3Schema();
  }

  get step4ValidationSchema() {
    return step4Schema();
  }

  get step5ValidationSchema() {
    return step5Schema();
  }

  get step6ValidationSchema() {
    return step6Schema();
  }

  get step7ValidationSchema() {
    return step7Schema();
  }

  get step8ValidationSchema() {
    return step8Schema();
  }

  get currentValidationSchema() {
    switch (this.currentStep) {
      case 1:
        return this.step1ValidationSchema;
      case 2:
        return this.step2ValidationSchema;
      case 3:
        return this.step3ValidationSchema;
      case 4:
        return this.step4ValidationSchema;
      case 5:
        return this.step5ValidationSchema;
      case 6:
        return this.step6ValidationSchema;
      case 7:
        return this.step7ValidationSchema;
      default:
        return this.step8ValidationSchema;
    }
  }

  get isStep1() {
    return this.currentStep === 1;
  }

  get isStep2() {
    return this.currentStep === 2;
  }

  get isStep3() {
    return this.currentStep === 3;
  }

  get isStep4() {
    return this.currentStep === 4;
  }

  get isStep5() {
    return this.currentStep === 5;
  }

  get isStep6() {
    return this.currentStep === 6;
  }

  get isStep7() {
    return this.currentStep === 7;
  }

  get isStep8() {
    return this.currentStep === 8;
  }

  get isLastStep() {
    return this.currentStep === 8;
  }

  get canGoNext() {
    return this.currentStep < 8;
  }

  get canGoPrevious() {
    return this.currentStep > 1;
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
      } else if (this.currentStep === 3) {
        await this.step3ValidationSchema.parseAsync({
          reasons: data.reasons,
          subReasons: data.subReasons,
        });
      } else if (this.currentStep === 4) {
        await this.step4ValidationSchema.parseAsync({
          dataSubjectCategories: data.dataSubjectCategories,
          subjectCategoryPrecisions: data.subjectCategoryPrecisions,
        });
      } else if (this.currentStep === 5) {
        await this.step5ValidationSchema.parseAsync({
          personalDataGroup: data.personalDataGroup,
          financialDataGroup: data.financialDataGroup,
          dataSources: data.dataSources,
        });
      } else if (this.currentStep === 6) {
        await this.step6ValidationSchema.parseAsync({
          legalBase: data.legalBase,
        });
      } else if (this.currentStep === 7) {
        await this.step7ValidationSchema.parseAsync({
          dataAccess: data.dataAccess,
          sharedData: data.sharedData,
          areDataExportedOutsideEU: data.areDataExportedOutsideEU,
          recipient: data.recipient,
        });
      } else if (this.currentStep === 8) {
        await this.step8ValidationSchema.parseAsync({
          securitySetup: data.securitySetup,
        });
      }

      const cleared = { ...this.stepErrors };
      delete cleared[this.currentStep];
      this.stepErrors = cleared;
      return true;
    } catch {
      this.stepErrors = { ...this.stepErrors, [this.currentStep]: true };
      this.flashMessages.danger(
        this.intl.t('treatments.form.validation.stepInvalid')
      );
      return false;
    } finally {
      this.isValidating = false;
    }
  }

  @action
  goToStep(stepNumber: number) {
    this.syncStepToUrl(stepNumber);
  }

  @action
  async goToNextStep() {
    const isValid = await this.validateCurrentStep();
    if (isValid && this.canGoNext) {
      this.syncStepToUrl(this.currentStep + 1);
    }
  }

  @action
  goToPreviousStep() {
    if (this.canGoPrevious) {
      this.syncStepToUrl(this.currentStep - 1);
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
          this.intl.t('treatments.form.messages.draftSaved')
        );
      } catch {
        this.flashMessages.danger(
          this.intl.t('treatments.form.messages.saveFailed')
        );
      } finally {
        this.isSaving = false;
      }
    }
  }

  @action
  skipStep() {
    if (this.canGoNext) {
      this.syncStepToUrl(this.currentStep + 1);
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
        this.intl.t('treatments.form.messages.treatmentCreated')
      );
    } catch {
      this.flashMessages.danger(
        this.intl.t('treatments.form.messages.saveFailed')
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
      <FormSteps @steps={{this.steps}} @onStepClick={{this.goToStep}} />
      <TpkForm
        {{! @glint-expect-error: Changeset type mismatch with TpkForm generic }}
        @changeset={{@changeset}}
        @validationSchema={{this.currentValidationSchema}}
        @onSubmit={{if this.isLastStep this.handleFinish this.goToNextStep}}
        as |F|
      >
        <div class="rounded-lg shadow-lg p-8">
          {{#if this.isStep1}}
            <Step1Name @form={{F}} @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep2}}
            <Step2GeneralInfo @form={{F}} @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep3}}
            <Step3Purposes @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep4}}
            <Step4Categories @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep5}}
            <Step5Data @form={{F}} @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep6}}
            <Step6LegalBasis @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep7}}
            <Step7DataSharing @form={{F}} @changeset={{@changeset}} />
          {{/if}}
          {{#if this.isStep8}}
            <Step8Security @changeset={{@changeset}} />
          {{/if}}
          <FormNavigation
            @isFirstStep={{this.isStep1}}
            @isLastStep={{this.isLastStep}}
            @isSaving={{this.isSaving}}
            @isValidating={{this.isValidating}}
            @onCancel={{this.handleCancel}}
            @onPrevious={{this.goToPreviousStep}}
            @onSaveDraft={{this.handleSaveDraft}}
            @onSkip={{this.skipStep}}
          />
        </div>
      </TpkForm>
    </div>
  </template>
}
