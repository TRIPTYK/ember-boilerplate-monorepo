import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

export type StepStatus = 'current' | 'done' | 'error' | 'pending';

export interface FormStep {
  number: number;
  label: string;
  status: StepStatus;
}

interface FormStepsSignature {
  Args: {
    steps: FormStep[];
    onStepClick: (stepNumber: number) => void;
  };
}

function stepClass(status: StepStatus): string {
  const base = 'step cursor-pointer';
  switch (status) {
    case 'done':
      return `${base} step-success`;
    case 'error':
      return `${base} step-error`;
    case 'current':
      return `${base} step-primary`;
    default:
      return base;
  }
}

function stepContent(status: StepStatus): string | undefined {
  if (status === 'done') return '✓';
  if (status === 'error') return '✕';
  return undefined;
}

const FormSteps: TOC<FormStepsSignature> = <template>
  <ul class="steps steps-horizontal w-full">
    {{#each @steps as |step|}}
      <li
        class={{stepClass step.status}}
        data-content={{stepContent step.status}}
        role="button"
        {{on "click" (fn @onStepClick step.number)}}
      >
        {{step.label}}
      </li>
    {{/each}}
  </ul>
</template>;

export default FormSteps;
