import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';
import PrecisionsModal from '#src/components/ui/precisions-modal.gts';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
import InfoIcon from '#src/assets/icons/info.gts';
import { on } from '@ember/modifier';

const PREDEFINED_SECURITY_MEASURES = [
  'Accès contrôlé',
  'Gestion des autorisations',
  'Tests de sécurité',
  'Sauvegardes régulières',
  'Sécurité réseau',
  'Sécurité des partenaires',
  'Chiffrement des données',
  'Anonymisation',
  'Pseudonymisation',
  'Audit',
  'Double authentification',
  'Pare-feu',
  'Formation à la sécurité',
];

interface Step8Signature {
  Args: {
    changeset: TreatmentChangeset;
  };
}

export default class Step8Security extends Component<Step8Signature> {
  @tracked customOptions: string[] = [];
  @tracked isPrecisionsModalOpen = false;
  @tracked isInfoModalOpen = false;

  get allOptions(): string[] {
    return [...PREDEFINED_SECURITY_MEASURES, ...this.customOptions];
  }

  get securitySetup(): Array<{ name: string; additionalInformation?: string }> {
    return this.args.changeset.get('securitySetup') ?? [];
  }

  get selectedNames(): string[] {
    return this.securitySetup.map((s) => s.name);
  }

  @action
  selectMeasure(name: string): void {
    if (!this.allOptions.includes(name)) {
      this.customOptions = [...this.customOptions, name];
    }
    if (!this.securitySetup.some((s) => s.name === name)) {
      this.args.changeset.set('securitySetup', [
        ...this.securitySetup,
        { name, additionalInformation: '' },
      ]);
    }
  }

  @action
  removeMeasure(name: string): void {
    this.args.changeset.set(
      'securitySetup',
      this.securitySetup.filter((s) => s.name !== name)
    );
  }

  @action
  updatePrecisions(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set(
      'securitySetup',
      updated as Array<{ name: string; additionalInformation?: string }>
    );
  }

  @action
  openPrecisionsModal(): void {
    this.isPrecisionsModalOpen = true;
  }

  @action
  closePrecisionsModal(): void {
    this.isPrecisionsModalOpen = false;
  }

  @action
  openInfoModal(): void {
    this.isInfoModalOpen = true;
  }

  @action
  closeInfoModal(): void {
    this.isInfoModalOpen = false;
  }

  <template>
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-center gap-2 mb-6">
        <h4 class="text-2xl font-semibold text-base-content">
          {{t "treatments.form.step8.title"}}
        </h4>
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle"
          aria-label={{t "treatments.form.step8.infoModalTitle"}}
          {{on "click" this.openInfoModal}}
        >
          <InfoIcon class="size-6 stroke-current" />
        </button>
      </div>

      <div class="card bg-base-100 shadow p-6 flex flex-col gap-4">
        <h5 class="font-semibold text-base-content text-sm">
          {{t "treatments.form.step8.question"}}
        </h5>
        <SearchableOptionsGroup
          @allOptions={{this.allOptions}}
          @selected={{this.selectedNames}}
          @onSelect={{this.selectMeasure}}
          @onRemove={{this.removeMeasure}}
          @allowCustomValues={{true}}
          @placeholder={{t "treatments.form.step8.searchPlaceholder"}}
        />
        <div class="mt-auto pt-4">
          <TpkButtonComponent
            @label={{t "treatments.form.step8.precisions"}}
            @onClick={{this.openPrecisionsModal}}
            class="btn btn-warning btn-sm w-full"
          >
            {{t "treatments.form.step8.precisions"}}
          </TpkButtonComponent>
        </div>
      </div>

      <PrecisionsModal
        @isOpen={{this.isPrecisionsModalOpen}}
        @onClose={{this.closePrecisionsModal}}
        @title={{t "treatments.form.step8.precisionsModalTitle"}}
        @options={{this.selectedNames}}
        @values={{this.securitySetup}}
        @emptyMessage={{t "treatments.form.step8.emptyMessage"}}
        @onChange={{this.updatePrecisions}}
      />

      <TpkModal
        @isOpen={{this.isInfoModalOpen}}
        @onClose={{this.closeInfoModal}}
        @title={{t "treatments.form.step8.infoModalTitle"}}
        as |M|
      >
        <M.Content>
          <div class="space-y-4 mt-3">
            <p class="text-base-content text-sm">
              {{t "treatments.form.step8.infoModalContent"}}
            </p>
            <a
              href="https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles"
              target="_blank"
              rel="noopener noreferrer"
              class="link link-primary text-sm"
            >
              {{t "treatments.form.step8.infoModalLink"}}
            </a>
          </div>
          <div class="flex justify-end mt-6 pt-4 border-t border-base-300">
            <TpkButtonComponent
              @onClick={{this.closeInfoModal}}
              @label={{t "treatments.form.step8.infoModalClose"}}
              class="btn btn-primary"
            >
              {{t "treatments.form.step8.infoModalClose"}}
            </TpkButtonComponent>
          </div>
        </M.Content>
      </TpkModal>
    </div>
  </template>
}
