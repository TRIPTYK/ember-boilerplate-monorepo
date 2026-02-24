import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';
import PrecisionsModal from '#src/components/ui/precisions-modal.gts';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';

const PREDEFINED_CATEGORIES = [
  'Clients',
  'Employés',
  'Fournisseurs',
  'Partenaires',
  'Prospects',
  'Candidats',
  'Visiteurs',
  'Sous-traitants',
  'Actionnaires',
  'Formulaire de contact',
];

interface Step4Signature {
  Args: {
    changeset: TreatmentChangeset;
  };
}

export default class Step4Categories extends Component<Step4Signature> {
  @tracked customOptions: string[] = [];
  @tracked isModalOpen = false;

  get allOptions(): string[] {
    return [...PREDEFINED_CATEGORIES, ...this.customOptions];
  }

  get selectedCategories(): string[] {
    return this.args.changeset.get('dataSubjectCategories') ?? [];
  }

  get precisions(): { name?: string; additionalInformation?: string }[] {
    return this.args.changeset.get('subjectCategoryPrecisions') ?? [];
  }

  @action
  selectCategory(value: string): void {
    if (!this.allOptions.includes(value)) {
      this.customOptions = [...this.customOptions, value];
    }
    const current = this.selectedCategories;
    if (!current.includes(value)) {
      this.args.changeset.set('dataSubjectCategories', [...current, value]);
    }
  }

  @action
  removeCategory(value: string): void {
    this.args.changeset.set(
      'dataSubjectCategories',
      this.selectedCategories.filter((c) => c !== value)
    );
  }

  @action
  updatePrecisions(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set('subjectCategoryPrecisions', updated);
  }

  @action
  openModal(): void {
    this.isModalOpen = true;
  }

  @action
  closeModal(): void {
    this.isModalOpen = false;
  }

  <template>
    <h4 class="text-2xl font-semibold text-center text-base-content">
      {{t "treatments.form.step4.title"}}
    </h4>
    <SearchableOptionsGroup
      @allOptions={{this.allOptions}}
      @selected={{this.selectedCategories}}
      @onSelect={{this.selectCategory}}
      @onRemove={{this.removeCategory}}
      @allowCustomValues={{true}}
      @placeholder={{t "treatments.form.step4.labels.searchPlaceholder"}}
      @popularLabel={{t "treatments.form.step4.labels.popular"}}
    />
    <TpkButtonComponent
      @label={{t "treatments.form.step4.labels.precisions"}}
      @onClick={{this.openModal}}
      class="btn btn-warning mt-4"
    >
      {{t "treatments.form.step4.labels.precisions"}}
    </TpkButtonComponent>
    <PrecisionsModal
      @isOpen={{this.isModalOpen}}
      @onClose={{this.closeModal}}
      @title={{t "treatments.form.step4.labels.precisions"}}
      @options={{this.selectedCategories}}
      @values={{this.precisions}}
      @emptyMessage={{t "treatments.form.step4.labels.noCategoriesSelected"}}
      @onChange={{this.updatePrecisions}}
    />
  </template>
}
