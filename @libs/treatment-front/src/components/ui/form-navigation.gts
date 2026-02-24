import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import type { TOC } from '@ember/component/template-only';

interface FormNavigationSignature {
  Args: {
    isFirstStep: boolean;
    isLastStep: boolean;
    isSaving: boolean;
    isValidating: boolean;
    onCancel: () => void;
    onPrevious: () => void;
    onSaveDraft: () => void;
    onSkip: () => void;
  };
}

const FormNavigation: TOC<FormNavigationSignature> = <template>
  <div class="flex items-center justify-between mt-8 pt-6 border-t">
    <div class="flex gap-3">
      {{#if @isFirstStep}}
        <button
          type="button"
          {{on "click" @onCancel}}
          class="btn btn-outline btn-primary"
          disabled={{@isSaving}}
        >
          {{t "treatments.form.navigation.cancel"}}
        </button>
      {{else}}
        <button
          type="button"
          {{on "click" @onPrevious}}
          class="btn btn-outline btn-primary"
          disabled={{@isSaving}}
        >
          {{t "treatments.form.navigation.previous"}}
        </button>
      {{/if}}

      {{#unless @isFirstStep}}
        <button
          type="button"
          {{on "click" @onSaveDraft}}
          class="btn btn-outline btn-primary"
          disabled={{@isSaving}}
        >
          {{t "treatments.form.navigation.save"}}
        </button>

        <button
          type="button"
          {{on "click" @onSkip}}
          class="btn btn-outline btn-primary"
          disabled={{@isSaving}}
        >
          {{t "treatments.form.navigation.skip"}}
        </button>
      {{/unless}}
    </div>

    <div>
      {{#if @isFirstStep}}
        <button
          type="submit"
          class="btn btn-warning"
          disabled={{@isValidating}}
        >
          {{t "treatments.form.navigation.start"}}
        </button>
      {{else if @isLastStep}}
        <button type="submit" class="btn btn-warning" disabled={{@isSaving}}>
          {{t "treatments.form.navigation.finish"}}
        </button>
      {{else}}
        <button
          type="submit"
          class="btn btn-warning"
          disabled={{@isValidating}}
        >
          {{t "treatments.form.navigation.next"}}
        </button>
      {{/if}}
    </div>
  </div>
</template>;

export default FormNavigation;
