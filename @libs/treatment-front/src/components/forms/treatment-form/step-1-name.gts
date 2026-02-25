import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import type SettingService from '#src/services/setting.ts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import type { WithBoundArgs } from '@glint/template';
import type TpkValidationSelectPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-select';
import type TpkValidationTextareaPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-textarea';
import type TpkValidationInputComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
import { t } from 'ember-intl';

const PREDEFINED_TREATMENT_TYPES = [
  'Ressources Humaines',
  'Marketing',
  'Ventes',
  'Finance',
  'IT',
];

interface Step1NameSignature {
  Args: {
    form: {
      TpkInputPrefab: WithBoundArgs<
        typeof TpkValidationInputComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
      TpkSelectPrefab: WithBoundArgs<
        typeof TpkValidationSelectPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
      TpkTextareaPrefab: WithBoundArgs<
        typeof TpkValidationTextareaPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
    };
    changeset: TreatmentChangeset;
  };
  Element: HTMLDivElement;
}

export default class Step1Name extends Component<Step1NameSignature> {
  @service declare setting: SettingService;
  @tracked settingTreatmentTypes: string[] = [];

  constructor(owner: Owner, args: Step1NameSignature['Args']) {
    super(owner, args);
    void this.loadFromSettings();
  }

  async loadFromSettings(): Promise<void> {
    try {
      const s = await this.setting.load('customTreatmentTypes');
      this.settingTreatmentTypes = (s.value as string[]) ?? [];
    } catch {
      // settings unavailable, use empty list
    }
  }

  get treatmentTypes() {
    return [...PREDEFINED_TREATMENT_TYPES, ...this.settingTreatmentTypes].map(
      (label) => ({
        value: label,
        label,
        toString() {
          return this.label;
        },
      })
    );
  }

  selectTreatmentType = (type: unknown) => {
    const selected = (type as { value: string }).value;
    this.args.changeset.set('treatmentType', selected);
  };

  <template>
    <div ...attributes>
      <div>
        <h4 class="text-2xl font-semibold text-center text-base-content">
          {{t "treatments.form.step1.title"}}
        </h4>
      </div>

      <div class="grid grid-cols-12">
        <@form.TpkInputPrefab
          @label={{t "treatments.form.step1.labels.title"}}
          @validationField="title"
          @placeholder={{t "treatments.form.step1.placeholders.title"}}
          class="col-span-12"
        />

        <@form.TpkSelectPrefab
          @label={{t "treatments.form.step1.labels.treatmentType"}}
          @validationField="treatmentType"
          @placeholder={{t "treatments.form.step1.placeholders.treatmentType"}}
          @options={{this.treatmentTypes}}
          @onChange={{this.selectTreatmentType}}
          class="col-span-12"
        />

        <@form.TpkTextareaPrefab
          @label={{t "treatments.form.step1.labels.description"}}
          @validationField="description"
          @placeholder={{t "treatments.form.step1.placeholders.description"}}
          class="col-span-12"
        />
      </div>
    </div>
  </template>
}
