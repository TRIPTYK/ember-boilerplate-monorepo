import Component from '@glimmer/component';
import { t } from 'ember-intl';

interface Step1NameSignature {
  Args: {
    form: {
      TpkInputPrefab: any;
      TpkSelectPrefab: any;
      TpkTextareaPrefab: any;
    };
  };
  Element: HTMLDivElement;
}

export default class Step1Name extends Component<Step1NameSignature> {
  treatmentTypes = [
    { value: 'Ressources Humaines', label: 'Ressources Humaines' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Ventes', label: 'Ventes' },
    { value: 'Finance', label: 'Finance' },
    { value: 'IT', label: 'IT' },
    { value: 'Autre', label: 'Autre' },
  ];

  <template>
    <div class="space-y-6" ...attributes>
      <div>
        <h2 class="text-2xl font-semibold mb-4">
          {{t "treatments.wizard.step1.title"}}
        </h2>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <@form.TpkInputPrefab
          @label={{t "treatments.wizard.step1.labels.title"}}
          @validationField="title"
          @placeholder={{t "treatments.wizard.step1.placeholders.title"}}
          class="col-span-12"
        />

        <@form.TpkSelectPrefab
          @label={{t "treatments.wizard.step1.labels.treatmentType"}}
          @validationField="treatmentType"
          @placeholder={{t "treatments.wizard.step1.placeholders.treatmentType"}}
          @options={{this.treatmentTypes}}
          class="col-span-12"
        />

        <@form.TpkTextareaPrefab
          @label={{t "treatments.wizard.step1.labels.description"}}
          @validationField="description"
          @placeholder={{t "treatments.wizard.step1.placeholders.description"}}
          @rows={{4}}
          class="col-span-12"
        />
      </div>
    </div>
  </template>
}
