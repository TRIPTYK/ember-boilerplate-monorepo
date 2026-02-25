import Component from '@glimmer/component';
import { t } from 'ember-intl';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';
import HeaderCard from '#src/components/treatment-view/header-card.gts';
import GeneralInfo from '#src/components/treatment-view/general-info.gts';
import Purposes from '#src/components/treatment-view/purposes.gts';
import DataGroup from '#src/components/treatment-view/data-group.gts';
import LegalBase from '#src/components/treatment-view/legal-base.gts';
import Categories from '#src/components/treatment-view/categories.gts';
import DataSharing from '#src/components/treatment-view/data-sharing.gts';
import Security from '#src/components/treatment-view/security.gts';
import EuTransfers from '#src/components/treatment-view/eu-transfers.gts';
import type { Treatment, TreatmentData } from '#src/schemas/treatments.ts';

interface TreatmentViewSignature {
  Args: {
    treatment: Treatment & { id: string };
    onBack: () => void;
    onEdit: () => void;
  };
}

export default class TreatmentView extends Component<TreatmentViewSignature> {
  get data(): TreatmentData {
    return this.args.treatment.data;
  }

  get personalDataItems(): Array<{ name: string; isSensitive: boolean }> {
    return this.data.personalDataGroup?.data.name ?? [];
  }

  get financialDataItems(): Array<{ name: string; isSensitive: boolean }> {
    return this.data.financialDataGroup?.data.name ?? [];
  }

  get personalConservationDuration(): string | undefined {
    return this.data.personalDataGroup?.conservationDuration;
  }

  get financialConservationDuration(): string | undefined {
    return this.data.financialDataGroup?.conservationDuration;
  }

  get legalBaseItems(): Array<{
    name?: string;
    additionalInformation?: string;
  }> {
    return this.data.legalBase ?? [];
  }

  get subjectCategoriesRows(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    const categories = this.data.dataSubjectCategories ?? [];
    const precisions = this.data.subjectCategoryPrecisions ?? [];
    return categories.map((name) => {
      const found = precisions.find((p) => p.name === name);
      return { name, additionalInformation: found?.additionalInformation };
    });
  }

  get securitySetupItems(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    return this.data.securitySetup ?? [];
  }

  <template>
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">

      {{! ── Header actions ─────────────────────────────────────── }}
      <div class="flex justify-between items-center">
        <TpkButtonComponent
          @label={{t "treatments.details.back"}}
          @onClick={{@onBack}}
          class="btn btn-ghost gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{t "treatments.details.back"}}
        </TpkButtonComponent>
        <TpkButtonComponent
          @label={{t "treatments.details.edit"}}
          @onClick={{@onEdit}}
          class="btn btn-primary gap-2"
        >
          {{t "treatments.details.edit"}}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </TpkButtonComponent>
      </div>

      <HeaderCard @treatment={{@treatment}} />
      <GeneralInfo @data={{this.data}} />
      <Purposes @data={{this.data}} />
      <DataGroup
        @title="treatments.details.personalData"
        @items={{this.personalDataItems}}
        @conservationDuration={{this.personalConservationDuration}}
      />
      <DataGroup
        @title="treatments.details.financialData"
        @items={{this.financialDataItems}}
        @conservationDuration={{this.financialConservationDuration}}
      />
      <LegalBase @items={{this.legalBaseItems}} />
      <Categories @rows={{this.subjectCategoriesRows}} />
      <DataSharing @data={{this.data}} />
      <Security @items={{this.securitySetupItems}} />
      <EuTransfers @data={{this.data}} />

    </div>
  </template>
}
