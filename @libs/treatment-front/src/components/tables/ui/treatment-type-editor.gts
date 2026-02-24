import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import type { Treatment } from '#src/schemas/treatments.ts';

interface TreatmentTypeEditorArgs {
  Args: {
    row: Treatment;
    onUpdate: (treatment: Treatment, newType: string) => Promise<void>;
  };
}

export default class TreatmentTypeEditor extends Component<TreatmentTypeEditorArgs> {
  @tracked isEditing = false;

  hardcodedTypes = ['RH', 'Marketing', 'Finance', 'IT', 'Juridique'];

  get currentType(): string {
    return this.args.row.data.treatmentType || '-';
  }

  @action
  startEditing(event: MouseEvent): void {
    event.stopPropagation();
    this.isEditing = true;
  }

  @action
  async handleChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const newType = target.value;

    if (newType && newType !== this.args.row.data.treatmentType) {
      await this.args.onUpdate(this.args.row, newType);
    }

    this.isEditing = false;
  }

  @action
  handleBlur(): void {
    this.isEditing = false;
  }

  @action
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  <template>
    {{#if this.isEditing}}
      <select
        class="select select-sm select-bordered"
        value={{this.currentType}}
        {{on "change" this.handleChange}}
        {{on "blur" this.handleBlur}}
        {{on "click" this.stopPropagation}}
        aria-label="Select treatment type"
      >
        <option value="">{{t
            "treatments.table.advanced.filters.allTypes"
          }}</option>
        {{#each this.hardcodedTypes as |type|}}
          <option value={{type}}>{{type}}</option>
        {{/each}}
      </select>
    {{else}}
      <span
        class="badge badge-outline cursor-pointer hover:badge-primary"
        {{on "click" this.startEditing}}
        role="button"
        tabindex="0"
      >
        {{this.currentType}}
      </span>
    {{/if}}
  </template>
}
