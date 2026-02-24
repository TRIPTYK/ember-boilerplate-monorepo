import Component from '@glimmer/component';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
import TpkButton from '@triptyk/ember-input/components/tpk-button';
import TpkTextarea from '@triptyk/ember-input/components/tpk-textarea';
import { t } from 'ember-intl';

type Precision = { name?: string; additionalInformation?: string };

interface PrecisionsModalSignature {
  Args: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: string[];
    values: Precision[];
    emptyMessage: string;
    onChange: (values: Precision[]) => void;
  };
}

export default class PrecisionsModal extends Component<PrecisionsModalSignature> {
  getPrecisionForOption = (name: string): string => {
    const found = (this.args.values ?? []).find((p) => p.name === name);
    return found?.additionalInformation ?? '';
  };

  @action
  updatePrecision(name: string, value: string | number | Date | null): void {
    const current = this.args.values ?? [];
    const strValue = String(value ?? '');
    const exists = current.some((p) => p.name === name);
    let updated: Precision[];
    if (exists) {
      updated = current.map((p) =>
        p.name === name ? { ...p, additionalInformation: strValue } : p
      );
    } else {
      updated = [...current, { name, additionalInformation: strValue }];
    }
    this.args.onChange(updated);
  }

  <template>
    <TpkModal
      @isOpen={{@isOpen}}
      @onClose={{@onClose}}
      @title={{@title}}
      as |M|
    >
      <M.Content>
        <div class="space-y-4 overflow-y-auto mt-3 px-1">
          {{#each @options as |option|}}
            <TpkTextarea
              @label={{option}}
              @value={{this.getPrecisionForOption option}}
              @onChange={{fn this.updatePrecision option}}
              as |T|
            >
              <T.Label class="fieldset">
                <legend class="label">{{option}}</legend>
                <T.Input class="textarea textarea-bordered w-full" rows="1" />
              </T.Label>
            </TpkTextarea>
          {{/each}}

          {{#unless @options.length}}
            <p class="text-base-content/50 text-sm text-center py-4">
              {{@emptyMessage}}
            </p>
          {{/unless}}
        </div>

        {{! Footer buttons }}
        <div
          class="flex items-center justify-between mt-6 pt-4 border-t border-base-300"
        >
          <TpkButton
            @onClick={{@onClose}}
            @label={{t "treatments.form.step4.labels.cancel"}}
            class="btn btn-warning"
          >
            {{t "treatments.form.step4.labels.cancel"}}
          </TpkButton>
          <TpkButton
            @onClick={{@onClose}}
            @label={{t "treatments.form.step4.labels.save"}}
            class="btn btn-primary"
          >
            {{t "treatments.form.step4.labels.save"}}
          </TpkButton>
        </div>
      </M.Content>
    </TpkModal>
  </template>
}
