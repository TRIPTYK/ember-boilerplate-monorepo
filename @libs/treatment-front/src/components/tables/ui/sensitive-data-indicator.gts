import Component from '@glimmer/component';
import type { TreatmentData } from '#src/schemas/treatments.ts';

interface SensitiveDataIndicatorArgs {
  Args: {
    row: {
      data: TreatmentData;
    };
  };
}

export default class SensitiveDataIndicator extends Component<SensitiveDataIndicatorArgs> {
  get hasSensitiveData(): boolean {
    const personalDataHasSensitive =
      this.args.row.data.personalDataGroup?.data.name.some(
        (item) => item.isSensitive
      ) || false;

    const financialDataHasSensitive =
      this.args.row.data.financialDataGroup?.data.name.some(
        (item) => item.isSensitive
      ) || false;

    return personalDataHasSensitive || financialDataHasSensitive;
  }

  get iconClass(): string {
    return this.hasSensitiveData ? 'text-error' : 'text-success';
  }

  get tooltipKey(): string {
    return this.hasSensitiveData
      ? 'treatments.table.advanced.sensitiveData.present'
      : 'treatments.table.advanced.sensitiveData.absent';
  }

  <template>
    <div class="flex items-center justify-center">
      {{#if this.hasSensitiveData}}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5 {{this.iconClass}}"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      {{else}}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5 {{this.iconClass}}"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      {{/if}}
    </div>
  </template>
}
