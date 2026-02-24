import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import type TpkValidationSelectPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-select';
import type TpkValidationTextareaPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-textarea';
import type TpkValidationInputComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
import { t } from 'ember-intl';

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
  treatmentTypes = [
    {
      value: 'Ressources Humaines',
      label: 'Ressources Humaines',
      toString: function () {
        return this.label;
      },
    },
    {
      value: 'Marketing',
      label: 'Marketing',
      toString: function () {
        return this.label;
      },
    },
    {
      value: 'Ventes',
      label: 'Ventes',
      toString: function () {
        return this.label;
      },
    },
    {
      value: 'Finance',
      label: 'Finance',
      toString: function () {
        return this.label;
      },
    },
    {
      value: 'IT',
      label: 'IT',
      toString: function () {
        return this.label;
      },
    },
  ];

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
