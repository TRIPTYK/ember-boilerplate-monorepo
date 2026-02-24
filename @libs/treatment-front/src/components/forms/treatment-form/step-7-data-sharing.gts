import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import type TpkValidationInputPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
import type { WithBoundArgs } from '@glint/template';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';
import PrecisionsModal from '#src/components/ui/precisions-modal.gts';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';
import type TpkValidationCheckboxPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-checkbox';

const PREDEFINED_DATA_ACCESS = [
  'Employés',
  'Administrateurs',
  'Gestionnaires',
  'Fournisseurs externes',
  'Équipe technique',
  'Service client',
];

const PREDEFINED_SHARED_DATA = [
  'Partenaires',
  'Fournisseurs',
  'Régulateurs',
  'Filiales',
  'Administration publique',
  'Clients',
];

interface Step7Signature {
  Args: {
    form: {
      TpkInputPrefab: WithBoundArgs<
        typeof TpkValidationInputPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
      TpkCheckboxPrefab: WithBoundArgs<
        typeof TpkValidationCheckboxPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
    };
    changeset: TreatmentChangeset;
  };
}

export default class Step7DataSharing extends Component<Step7Signature> {
  @tracked customDataAccessOptions: string[] = [];
  @tracked customSharedDataOptions: string[] = [];
  @tracked isDataAccessModalOpen = false;
  @tracked isSharedDataModalOpen = false;

  // Section 1 — Accès aux données

  get allDataAccessOptions(): string[] {
    return [...PREDEFINED_DATA_ACCESS, ...this.customDataAccessOptions];
  }

  get dataAccess(): Array<{ name: string; additionalInformation?: string }> {
    return this.args.changeset.get('dataAccess') ?? [];
  }

  get selectedDataAccessNames(): string[] {
    return this.dataAccess.map((d) => d.name);
  }

  @action
  selectDataAccess(name: string): void {
    if (!this.allDataAccessOptions.includes(name)) {
      this.customDataAccessOptions = [...this.customDataAccessOptions, name];
    }
    if (!this.dataAccess.some((d) => d.name === name)) {
      this.args.changeset.set('dataAccess', [
        ...this.dataAccess,
        { name, additionalInformation: '' },
      ]);
    }
  }

  @action
  removeDataAccess(name: string): void {
    this.args.changeset.set(
      'dataAccess',
      this.dataAccess.filter((d) => d.name !== name)
    );
  }

  @action
  updateDataAccessPrecisions(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set(
      'dataAccess',
      updated as Array<{ name: string; additionalInformation?: string }>
    );
  }

  @action
  openDataAccessModal(): void {
    this.isDataAccessModalOpen = true;
  }

  @action
  closeDataAccessModal(): void {
    this.isDataAccessModalOpen = false;
  }

  get allSharedDataOptions(): string[] {
    return [...PREDEFINED_SHARED_DATA, ...this.customSharedDataOptions];
  }

  get sharedData(): Array<{ name: string; additionalInformation?: string }> {
    return this.args.changeset.get('sharedData') ?? [];
  }

  get selectedSharedDataNames(): string[] {
    return this.sharedData.map((s) => s.name);
  }

  @action
  selectSharedData(name: string): void {
    if (!this.allSharedDataOptions.includes(name)) {
      this.customSharedDataOptions = [...this.customSharedDataOptions, name];
    }
    if (!this.sharedData.some((s) => s.name === name)) {
      this.args.changeset.set('sharedData', [
        ...this.sharedData,
        { name, additionalInformation: '' },
      ]);
    }
  }

  @action
  removeSharedData(name: string): void {
    this.args.changeset.set(
      'sharedData',
      this.sharedData.filter((s) => s.name !== name)
    );
  }

  @action
  updateSharedDataPrecisions(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set(
      'sharedData',
      updated as Array<{ name: string; additionalInformation?: string }>
    );
  }

  @action
  openSharedDataModal(): void {
    this.isSharedDataModalOpen = true;
  }

  @action
  closeSharedDataModal(): void {
    this.isSharedDataModalOpen = false;
  }

  get areDataExportedOutsideEU(): boolean {
    return this.args.changeset.get('areDataExportedOutsideEU') ?? false;
  }

  <template>
    <h4 class="text-2xl font-semibold text-center text-base-content mb-6">
      {{t "treatments.form.step7.title"}}
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3 min-h-[700px]">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step7.section1.title"}}
        </h5>
        <p class="text-base-content/70 text-sm">
          {{t "treatments.form.step7.section1.question"}}
        </p>
        <SearchableOptionsGroup
          @allOptions={{this.allDataAccessOptions}}
          @selected={{this.selectedDataAccessNames}}
          @onSelect={{this.selectDataAccess}}
          @onRemove={{this.removeDataAccess}}
          @allowCustomValues={{true}}
          @placeholder={{t "treatments.form.step7.section1.searchPlaceholder"}}
        />
        <div class="mt-auto pt-4">
          <TpkButtonComponent
            @label={{t "treatments.form.step7.precisions"}}
            @onClick={{this.openDataAccessModal}}
            class="btn btn-warning btn-sm w-full"
          >
            {{t "treatments.form.step7.precisions"}}
          </TpkButtonComponent>
        </div>
        <PrecisionsModal
          @isOpen={{this.isDataAccessModalOpen}}
          @onClose={{this.closeDataAccessModal}}
          @title={{t "treatments.form.step7.section1.modalTitle"}}
          @options={{this.selectedDataAccessNames}}
          @values={{this.dataAccess}}
          @emptyMessage={{t "treatments.form.step7.section1.emptyMessage"}}
          @onChange={{this.updateDataAccessPrecisions}}
        />
      </div>

      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3 min-h-[700px]">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step7.section2.title"}}
        </h5>
        <p class="text-base-content/70 text-sm">
          {{t "treatments.form.step7.section2.question"}}
        </p>
        <SearchableOptionsGroup
          @allOptions={{this.allSharedDataOptions}}
          @selected={{this.selectedSharedDataNames}}
          @onSelect={{this.selectSharedData}}
          @onRemove={{this.removeSharedData}}
          @allowCustomValues={{true}}
          @placeholder={{t "treatments.form.step7.section2.searchPlaceholder"}}
        />
        <div class="mt-auto pt-4">
          <TpkButtonComponent
            @label={{t "treatments.form.step7.precisions"}}
            @onClick={{this.openSharedDataModal}}
            class="btn btn-warning btn-sm w-full"
          >
            {{t "treatments.form.step7.precisions"}}
          </TpkButtonComponent>
        </div>
        <PrecisionsModal
          @isOpen={{this.isSharedDataModalOpen}}
          @onClose={{this.closeSharedDataModal}}
          @title={{t "treatments.form.step7.section2.modalTitle"}}
          @options={{this.selectedSharedDataNames}}
          @values={{this.sharedData}}
          @emptyMessage={{t "treatments.form.step7.section2.emptyMessage"}}
          @onChange={{this.updateSharedDataPrecisions}}
        />
      </div>

      <div class="card bg-base-100 shadow p-4 flex flex-col gap-3 min-h-[700px]">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step7.section3.title"}}
        </h5>
        <@form.TpkCheckboxPrefab
          @label={{t "treatments.form.step7.section3.switchLabel"}}
          @validationField="areDataExportedOutsideEU"
          class="flex! justify-between w-full"
        />
        {{#if this.areDataExportedOutsideEU}}
          <div class="mt-4 flex flex-col gap-3">
            <h6 class="font-semibold text-base-content text-sm">
              {{t "treatments.form.step7.section3.recipientInfo"}}
            </h6>
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step7.section3.recipientName"}}
              @validationField="recipient.fullName"
              class="w-full"
            />
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step7.section3.recipientCountry"}}
              @validationField="recipient.country"
              class="w-full"
            />
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step7.section3.guaranteeTypes"}}
              @validationField="recipient.guaranteeTypes"
              class="w-full"
            />
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step7.section3.linkToDoc"}}
              @validationField="recipient.linkToDoc"
              class="w-full"
            />
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}
