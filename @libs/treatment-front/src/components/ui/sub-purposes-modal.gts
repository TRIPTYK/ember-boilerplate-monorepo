import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
import TpkInput from '@triptyk/ember-input/components/tpk-input';
import TpkTextarea from '@triptyk/ember-input/components/tpk-textarea';
import TpkButton from '@triptyk/ember-input/components/tpk-button';
import { t } from 'ember-intl';

type SubReason = { name?: string; additionalInformation?: string };

interface SubPurposesModalSignature {
  Args: {
    isOpen: boolean;
    onClose: () => void;
    subReasons: SubReason[];
    onChange: (subReasons: SubReason[]) => void;
  };
}

export default class SubPurposesModal extends Component<SubPurposesModalSignature> {
  @tracked isAddingNew = false;
  @tracked newName = '';
  @tracked newDescription = '';

  get canAdd(): boolean {
    return (
      this.newName.trim().length > 0 && this.newDescription.trim().length > 0
    );
  }

  @action
  startAdding(): void {
    this.isAddingNew = true;
    this.newName = '';
    this.newDescription = '';
  }

  @action
  cancelAdding(): void {
    this.isAddingNew = false;
    this.newName = '';
    this.newDescription = '';
  }

  @action
  confirmAdd(): void {
    if (!this.canAdd) return;
    const updated = [
      ...(this.args.subReasons ?? []),
      {
        name: this.newName.trim(),
        additionalInformation: this.newDescription.trim(),
      },
    ];
    this.args.onChange(updated);
    this.isAddingNew = false;
    this.newName = '';
    this.newDescription = '';
  }

  @action
  removeItem(index: number): void {
    const updated = (this.args.subReasons ?? []).filter((_, i) => i !== index);
    this.args.onChange(updated);
  }

  @action
  updateDescription(index: number, value: string): void {
    const updated = (this.args.subReasons ?? []).map((item, i) =>
      i === index ? { ...item, additionalInformation: value } : item
    );
    this.args.onChange(updated);
  }

  @action
  handleNewName(value: string | number | Date | null): void {
    this.newName = String(value ?? '');
  }

  @action
  handleNewDescription(value: string | number | Date | null): void {
    this.newDescription = String(value ?? '');
  }

  <template>
    <TpkModal
      @isOpen={{@isOpen}}
      @onClose={{@onClose}}
      @title={{t "treatments.form.step3.labels.subPurposes"}}
      as |M|
    >
      <M.Content>
        <div class="space-y-4 overflow-y-auto mt-3 px-1">
          {{#each @subReasons as |item index|}}
            <div class="flex gap-2 items-start">
              <div class="flex-1">
                <TpkTextarea
                  @label="{{if item.name item.name ''}}"
                  @value={{item.additionalInformation}}
                  @placeholder={{t
                    "treatments.form.step3.labels.subPurposeDescription"
                    name=item.name
                  }}
                  @onChange={{fn this.updateDescription index}}
                  as |T|
                >
                  <T.Label class="fieldset">
                    <legend class="label">{{if item.name item.name ""}}</legend>
                    <T.Input
                      class="textarea textarea-bordered w-full"
                      rows="1"
                    />
                  </T.Label>
                </TpkTextarea>
              </div>
              <TpkButton
                @onClick={{fn this.removeItem index}}
                @label={{t "treatments.form.step3.labels.removeSubPurpose"}}
                class="btn btn-circle btn-sm btn-ghost hover:btn-error mt-6 flex-shrink-0"
                aria-label={{t "treatments.form.step3.labels.removeSubPurpose"}}
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </TpkButton>
            </div>
          {{/each}}

          {{! Add new sub-reason form }}
          {{#if this.isAddingNew}}
            <div class="border border-warning rounded-lg p-4 space-y-3">
              <TpkInput
                @label={{t "treatments.form.step3.labels.subPurposeName"}}
                @value={{this.newName}}
                @placeholder={{t
                  "treatments.form.step3.labels.subPurposeNamePlaceholder"
                }}
                @onChange={{this.handleNewName}}
                as |I|
              >
                <I.Label class="label label-text" />
                <I.Input class="input input-bordered w-full" />
              </TpkInput>
              <TpkTextarea
                @label={{t
                  "treatments.form.step3.labels.subPurposeDescription"
                  name=this.newName
                }}
                @value={{this.newDescription}}
                @placeholder={{t
                  "treatments.form.step3.labels.subPurposeDescriptionPlaceholder"
                  name=this.newName
                }}
                @onChange={{this.handleNewDescription}}
                as |T|
              >
                <T.Label class="label label-text" />
                <T.Input
                  class="textarea textarea-bordered w-full resize-y"
                  rows="1"
                />
              </TpkTextarea>
              <div class="flex gap-2 justify-end">
                <TpkButton
                  @onClick={{this.cancelAdding}}
                  @label={{t "treatments.form.step3.labels.cancel"}}
                  class="btn btn-circle btn-sm btn-ghost hover:btn-error"
                  aria-label={{t "treatments.form.step3.labels.cancel"}}
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </TpkButton>
                <TpkButton
                  @onClick={{this.confirmAdd}}
                  @label={{t "treatments.form.step3.labels.addSubPurpose"}}
                  @disabled={{if this.canAdd false true}}
                  class="btn btn-circle btn-sm
                    {{if this.canAdd 'btn-warning' 'btn-ghost btn-disabled'}}"
                  aria-label={{t "treatments.form.step3.labels.addSubPurpose"}}
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </TpkButton>
              </div>
            </div>
          {{else}}
            <TpkButton
              @onClick={{this.startAdding}}
              @label={{t "treatments.form.step3.labels.addSubPurpose"}}
              class="btn btn-warning btn-outline gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{t "treatments.form.step3.labels.addSubPurpose"}}
            </TpkButton>
          {{/if}}
        </div>

        {{! Footer buttons }}
        <div
          class="flex items-center justify-between mt-6 pt-4 border-t border-base-300"
        >
          <TpkButton
            @onClick={{@onClose}}
            @label={{t "treatments.form.step3.labels.addSubPurpose"}}
            class="btn btn-warning"
          >
            {{t "treatments.form.step3.labels.cancel"}}
          </TpkButton>
          <TpkButton
            @onClick={{@onClose}}
            @label={{t "treatments.form.step3.labels.save"}}
            class="btn btn-primary"
          >
            {{t "treatments.form.step3.labels.save"}}
          </TpkButton>
        </div>
      </M.Content>
    </TpkModal>
  </template>
}
