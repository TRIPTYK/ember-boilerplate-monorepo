import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { t, type IntlService } from 'ember-intl';
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
import TpkButton from '@triptyk/ember-input/components/tpk-button';
import type { SettingItemKey } from '#src/schemas/settings.ts';

const TABLE_KEYS: SettingItemKey[] = [
  'customTreatmentTypes',
  'customReasons',
  'customCategories',
  'customPersonalData',
  'customEconomicInformation',
  'customDataSources',
  'customLegalBase',
  'customDataAccess',
  'customSharedData',
  'customSharedDataAccess',
  'customMeasures',
];

interface SettingFormModalSignature {
  Args: {
    onClose: () => void;
    onSave: (data: {
      key: SettingItemKey;
      name: string;
      id?: string;
    }) => Promise<void>;
    editingItem: { id: string; key: SettingItemKey; name: string } | null;
  };
}

export default class SettingFormModal extends Component<SettingFormModalSignature> {
  @service declare intl: IntlService;

  @tracked name: string;
  @tracked selectedKey: SettingItemKey;
  @tracked isSaving = false;

  constructor(owner: Owner, args: SettingFormModalSignature['Args']) {
    super(owner, args);
    this.name = args.editingItem?.name ?? '';
    this.selectedKey = args.editingItem?.key ?? 'customCategories';
  }

  get isEditing(): boolean {
    return this.args.editingItem !== null;
  }

  get title(): string {
    return this.isEditing
      ? this.intl.t('settings.form.editTitle')
      : this.intl.t('settings.form.addTitle');
  }

  get submitLabel(): string {
    return this.isSaving
      ? this.intl.t('settings.form.saving')
      : this.intl.t('settings.form.save');
  }

  get isNameValid(): boolean {
    return this.name.trim().length >= 2;
  }

  get keyOptions(): Array<{ key: SettingItemKey; label: string }> {
    return TABLE_KEYS.map((key) => ({
      key,
      label: this.intl.t(`settings.types.${key}`),
    }));
  }

  @action
  setKey(e: Event): void {
    this.selectedKey = (e.target as HTMLSelectElement).value as SettingItemKey;
  }

  @action
  setName(e: Event): void {
    this.name = (e.target as HTMLInputElement).value;
  }

  @action
  async submit(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.isNameValid || this.isSaving) return;
    this.isSaving = true;
    try {
      await this.args.onSave({
        key: this.selectedKey,
        name: this.name.trim(),
        id: this.args.editingItem?.id,
      });
    } finally {
      this.isSaving = false;
    }
  }

  <template>
    <TpkModal
      @isOpen={{true}}
      @onClose={{@onClose}}
      @title={{this.title}}
      as |M|
    >
      <M.Content>
        <form id="settingForm" {{on "submit" this.submit}}>
          <div class="flex flex-col gap-4 mt-3">

            {{! Sélecteur de type — uniquement en mode création }}
            {{#unless this.isEditing}}
              <label class="fieldset">
                <span class="label">{{t "settings.form.typeLabel"}}</span>
                <select
                  class="select select-bordered w-full"
                  value={{this.selectedKey}}
                  {{on "change" this.setKey}}
                >
                  {{#each this.keyOptions as |opt|}}
                    <option value={{opt.key}}>{{opt.label}}</option>
                  {{/each}}
                </select>
              </label>
            {{/unless}}

            <label class="fieldset">
              <span class="label">{{t "settings.form.nameLabel"}}</span>
              <input
                type="text"
                class="input input-bordered w-full"
                value={{this.name}}
                minlength="2"
                required
                placeholder={{t "settings.form.namePlaceholder"}}
                {{on "input" this.setName}}
              />
            </label>

          </div>

          <div
            class="flex justify-end gap-2 mt-6 pt-4 border-t border-base-300"
          >
            <TpkButton
              @onClick={{@onClose}}
              @label={{t "settings.form.cancel"}}
              class="btn btn-ghost"
            >
              {{t "settings.form.cancel"}}
            </TpkButton>
            <button
              type="submit"
              form="settingForm"
              class="btn btn-primary"
              disabled={{this.isSaving}}
            >
              {{this.submitLabel}}
            </button>
          </div>
        </form>
      </M.Content>
    </TpkModal>
  </template>
}
