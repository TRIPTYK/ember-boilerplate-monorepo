import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';

const PREDEFINED_LEGAL_BASES = [
  'Consentement de la personne concernée',
  "Exécution d'un contrat (ou des mesures précontractuelles)",
  "Respect d'une obligation légale",
  'Sauvegarde des intérêts vitaux',
  "Exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique",
];

interface Step6Signature {
  Args: {
    changeset: TreatmentChangeset;
  };
}

export default class Step6LegalBasis extends Component<Step6Signature> {
  @tracked customOptions: string[] = [];

  get allOptions(): string[] {
    return [...PREDEFINED_LEGAL_BASES, ...this.customOptions];
  }

  get legalBase(): Array<{ name?: string; additionalInformation?: string }> {
    return this.args.changeset.get('legalBase') ?? [];
  }

  get selectedLegalBaseNames(): string[] {
    return this.legalBase.map((l) => l.name ?? '').filter(Boolean);
  }

  @action
  selectLegalBase(name: string): void {
    if (!this.allOptions.includes(name)) {
      this.customOptions = [...this.customOptions, name];
    }
    if (!this.legalBase.some((l) => l.name === name)) {
      this.args.changeset.set('legalBase', [
        ...this.legalBase,
        { name, additionalInformation: '' },
      ]);
    }
  }

  @action
  removeLegalBase(name: string): void {
    this.args.changeset.set(
      'legalBase',
      this.legalBase.filter((l) => l.name !== name)
    );
  }

  <template>
    <h4 class="text-2xl font-semibold text-center text-base-content mb-6">
      {{t "treatments.form.step6.title"}}
    </h4>
    <h5 class="font-semibold text-base-content text-sm mb-4">
      {{t "treatments.form.step6.labels.question"}}
    </h5>
    <SearchableOptionsGroup
      @allOptions={{this.allOptions}}
      @selected={{this.selectedLegalBaseNames}}
      @onSelect={{this.selectLegalBase}}
      @onRemove={{this.removeLegalBase}}
      @allowCustomValues={{true}}
      @placeholder={{t "treatments.form.step6.labels.searchPlaceholder"}}
    />
  </template>
}
