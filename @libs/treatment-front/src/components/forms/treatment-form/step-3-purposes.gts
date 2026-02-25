import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import type SettingService from '#src/services/setting.ts';
import SearchableOptionsGroup from '#src/components/ui/searchable-options-group.gts';
import SubPurposesModal from '#src/components/ui/sub-purposes-modal.gts';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';

const PREDEFINED_PURPOSES = [
  'Collecte de données',
  'Gestion des utilisateurs',
  'Marketing',
  'Analyse',
  'Conformité légale',
  'Amélioration du service',
  'Support client',
  'Recherche',
  'Sécurité',
];

interface Step3Signature {
  Args: {
    changeset: TreatmentChangeset;
  };
}

export default class Step3Purposes extends Component<Step3Signature> {
  @service declare setting: SettingService;
  @tracked settingReasons: string[] = [];
  @tracked isModalOpen = false;

  constructor(owner: Owner, args: Step3Signature['Args']) {
    super(owner, args);
    void this.loadFromSettings();
  }

  async loadFromSettings(): Promise<void> {
    try {
      const s = await this.setting.load('customReasons');
      this.settingReasons = (s.value as string[]) ?? [];
    } catch {
      // settings unavailable, use empty list
    }
  }

  get allOptions(): string[] {
    return [...PREDEFINED_PURPOSES, ...this.settingReasons];
  }

  get selectedReasons(): string[] {
    return this.args.changeset.get('reasons') ?? [];
  }

  get subReasons(): { name?: string; additionalInformation?: string }[] {
    return this.args.changeset.get('subReasons') ?? [];
  }

  @action
  selectReason(value: string): void {
    if (!this.allOptions.includes(value)) {
      const updated = [...this.settingReasons, value];
      this.settingReasons = updated;
      void this.setting.save('customReasons', updated);
    }
    const current = this.selectedReasons;
    if (!current.includes(value)) {
      this.args.changeset.set('reasons', [...current, value]);
    }
  }

  @action
  removeReason(value: string): void {
    this.args.changeset.set(
      'reasons',
      this.selectedReasons.filter((r) => r !== value)
    );
  }

  @action
  updateSubReasons(
    updated: { name?: string; additionalInformation?: string }[]
  ): void {
    this.args.changeset.set('subReasons', updated);
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
      {{t "treatments.form.step3.title"}}
    </h4>
    <SearchableOptionsGroup
      @allOptions={{this.allOptions}}
      @selected={{this.selectedReasons}}
      @onSelect={{this.selectReason}}
      @onRemove={{this.removeReason}}
      @allowCustomValues={{true}}
      @placeholder={{t "treatments.form.step3.labels.searchPlaceholder"}}
      @popularLabel={{t "treatments.form.step3.labels.popular"}}
    />
    <TpkButtonComponent
      @label={{t "treatments.form.step3.labels.subPurposes"}}
      @onClick={{this.openModal}}
      class="btn btn-warning mt-4"
    >
      {{t "treatments.form.step3.labels.subPurposes"}}
    </TpkButtonComponent>
    <SubPurposesModal
      @isOpen={{this.isModalOpen}}
      @onClose={{this.closeModal}}
      @subReasons={{this.subReasons}}
      @onChange={{this.updateSubReasons}}
    />
  </template>
}
