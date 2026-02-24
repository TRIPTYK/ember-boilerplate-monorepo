import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import type TpkValidationInputPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
import type { WithBoundArgs } from '@glint/template';
import SearchableOptionsGroupData, {
  type SensitiveDataItem,
} from '#src/components/ui/searchable-options-group-data.gts';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';
import PrecisionsModal from '#src/components/ui/precisions-modal.gts';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';

const PREDEFINED_PERSONAL_DATA = [
  'Nom',
  'Prénom',
  'Email',
  'Téléphone',
  'Données financières',
  'Données de santé',
  'Photographie',
];

const PREDEFINED_FINANCIAL_DATA = [
  'Comptes bancaires',
  'IBAN ou RIB',
  'Titulaire du compte',
  'Salaire',
  'Dépenses',
  'Prêts en cours',
  'Informations fiscales',
  "Chiffre d'affaires",
  'Bilan financier',
];

const PREDEFINED_DATA_SOURCES = [
  'Employé',
  'Agence intérim',
  'Formulaire en ligne',
  'Fichiers clients',
  'Réseaux sociaux',
  'Cookies et trackers',
];

interface Step5Signature {
  Args: {
    form: {
      TpkInputPrefab: WithBoundArgs<
        typeof TpkValidationInputPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
    };
    changeset: TreatmentChangeset;
  };
}

export default class Step5Data extends Component<Step5Signature> {
  @tracked customPersonalOptions: string[] = [];
  @tracked customFinancialOptions: string[] = [];
  @tracked customSourceOptions: string[] = [];
  @tracked isSourcesModalOpen = false;

  get allPersonalOptions(): string[] {
    return [...PREDEFINED_PERSONAL_DATA, ...this.customPersonalOptions];
  }

  get selectedPersonalData(): SensitiveDataItem[] {
    return this.args.changeset.get('personalDataGroup')?.data?.name ?? [];
  }

  get personalConservationDuration(): string {
    return (
      this.args.changeset.get('personalDataGroup')?.conservationDuration ?? ''
    );
  }

  @action
  selectPersonalData(name: string): void {
    if (!this.allPersonalOptions.includes(name)) {
      this.customPersonalOptions = [...this.customPersonalOptions, name];
    }
    if (!this.selectedPersonalData.some((item) => item.name === name)) {
      this.args.changeset.set('personalDataGroup', {
        data: {
          name: [...this.selectedPersonalData, { name, isSensitive: false }],
        },
        conservationDuration: this.personalConservationDuration,
      });
    }
  }

  @action
  removePersonalData(name: string): void {
    this.args.changeset.set('personalDataGroup', {
      data: {
        name: this.selectedPersonalData.filter((item) => item.name !== name),
      },
      conservationDuration: this.personalConservationDuration,
    });
  }

  @action
  togglePersonalDataSensitivity(name: string): void {
    this.args.changeset.set('personalDataGroup', {
      data: {
        name: this.selectedPersonalData.map((item) =>
          item.name === name
            ? { ...item, isSensitive: !item.isSensitive }
            : item
        ),
      },
      conservationDuration: this.personalConservationDuration,
    });
  }

  get allFinancialOptions(): string[] {
    return [...PREDEFINED_FINANCIAL_DATA, ...this.customFinancialOptions];
  }

  get selectedFinancialData(): SensitiveDataItem[] {
    return this.args.changeset.get('financialDataGroup')?.data?.name ?? [];
  }

  get financialConservationDuration(): string {
    return (
      this.args.changeset.get('financialDataGroup')?.conservationDuration ?? ''
    );
  }

  @action
  selectFinancialData(name: string): void {
    if (!this.allFinancialOptions.includes(name)) {
      this.customFinancialOptions = [...this.customFinancialOptions, name];
    }
    if (!this.selectedFinancialData.some((item) => item.name === name)) {
      this.args.changeset.set('financialDataGroup', {
        data: {
          name: [
            ...this.selectedFinancialData,
            { name, isSensitive: true }, // auto-sensible
          ],
        },
        conservationDuration: this.financialConservationDuration,
      });
    }
  }

  @action
  removeFinancialData(name: string): void {
    this.args.changeset.set('financialDataGroup', {
      data: {
        name: this.selectedFinancialData.filter((item) => item.name !== name),
      },
      conservationDuration: this.financialConservationDuration,
    });
  }

  @action
  toggleFinancialDataSensitivity(name: string): void {
    this.args.changeset.set('financialDataGroup', {
      data: {
        name: this.selectedFinancialData.map((item) =>
          item.name === name
            ? { ...item, isSensitive: !item.isSensitive }
            : item
        ),
      },
      conservationDuration: this.financialConservationDuration,
    });
  }

  get allSourceOptions(): string[] {
    return [...PREDEFINED_DATA_SOURCES, ...this.customSourceOptions];
  }

  get dataSources(): Array<{ name: string; additionalInformation?: string }> {
    return this.args.changeset.get('dataSources') ?? [];
  }

  get selectedSourceNames(): string[] {
    return this.dataSources.map((s) => s.name);
  }

  @action
  selectSource(name: string): void {
    if (!this.allSourceOptions.includes(name)) {
      this.customSourceOptions = [...this.customSourceOptions, name];
    }
    if (!this.dataSources.some((s) => s.name === name)) {
      this.args.changeset.set('dataSources', [
        ...this.dataSources,
        { name, additionalInformation: '' },
      ]);
    }
  }

  @action
  removeSource(name: string): void {
    this.args.changeset.set(
      'dataSources',
      this.dataSources.filter((s) => s.name !== name)
    );
  }

  @action
  updateSourcePrecisions(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set(
      'dataSources',
      updated as Array<{ name: string; additionalInformation?: string }>
    );
  }

  @action
  openSourcesModal(): void {
    this.isSourcesModalOpen = true;
  }

  @action
  closeSourcesModal(): void {
    this.isSourcesModalOpen = false;
  }

  <template>
    <h4 class="text-2xl font-semibold text-center text-base-content mb-6">
      {{t "treatments.form.step5.title"}}
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step5.labels.firstQuestion"}}
        </h5>
        <SearchableOptionsGroupData
          @allOptions={{this.allPersonalOptions}}
          @selected={{this.selectedPersonalData}}
          @onSelect={{this.selectPersonalData}}
          @onRemove={{this.removePersonalData}}
          @onToggleSensitivity={{this.togglePersonalDataSensitivity}}
          @allowCustomValues={{true}}
          @placeholder={{t
            "treatments.form.step5.labels.searchPersonalPlaceholder"
          }}
        />
        <div class="mt-auto pt-4">
          <@form.TpkInputPrefab
            @label={{t "treatments.form.step5.labels.conservationDuration"}}
            @validationField="personalDataGroup.conservationDuration"
            @placeholder={{t
              "treatments.form.step5.labels.conservationDurationPlaceholder"
            }}
            class="w-full"
          />
        </div>
      </div>

      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step5.labels.secondQuestion"}}
        </h5>
        <SearchableOptionsGroupData
          @allOptions={{this.allFinancialOptions}}
          @selected={{this.selectedFinancialData}}
          @onSelect={{this.selectFinancialData}}
          @onRemove={{this.removeFinancialData}}
          @onToggleSensitivity={{this.toggleFinancialDataSensitivity}}
          @allowCustomValues={{true}}
          @placeholder={{t
            "treatments.form.step5.labels.searchFinancialPlaceholder"
          }}
        />
        <div class="mt-auto pt-4">
          <@form.TpkInputPrefab
            @label={{t "treatments.form.step5.labels.conservationDuration"}}
            @validationField="financialDataGroup.conservationDuration"
            @placeholder={{t
              "treatments.form.step5.labels.conservationDurationPlaceholder"
            }}
            class="w-full"
          />
        </div>
      </div>

      {{! Section 3 — Sources des données }}
      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step5.labels.thirdQuestion"}}
        </h5>
        <SearchableOptionsGroup
          @allOptions={{this.allSourceOptions}}
          @selected={{this.selectedSourceNames}}
          @onSelect={{this.selectSource}}
          @onRemove={{this.removeSource}}
          @allowCustomValues={{true}}
          @placeholder={{t
            "treatments.form.step5.labels.searchSourcePlaceholder"
          }}
        />
        <TpkButtonComponent
          @label={{t "treatments.form.step5.labels.showPrecisions"}}
          @onClick={{this.openSourcesModal}}
          class="btn btn-warning btn-sm mt-2 w-fit"
        >
          {{t "treatments.form.step5.labels.showPrecisions"}}
        </TpkButtonComponent>
        <PrecisionsModal
          @isOpen={{this.isSourcesModalOpen}}
          @onClose={{this.closeSourcesModal}}
          @title={{t "treatments.form.step5.labels.precisionDetails"}}
          @options={{this.selectedSourceNames}}
          @values={{this.dataSources}}
          @emptyMessage={{t "treatments.form.step5.labels.noSourcesSelected"}}
          @onChange={{this.updateSourcePrecisions}}
        />
      </div>

    </div>
  </template>
}
