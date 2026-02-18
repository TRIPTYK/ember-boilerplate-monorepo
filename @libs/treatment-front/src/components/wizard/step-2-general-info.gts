import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

interface Step2GeneralInfoSignature {
  Args: {
    form: any;
    changeset: any;
  };
  Element: HTMLDivElement;
}

export default class Step2GeneralInfo extends Component<Step2GeneralInfoSignature> {
  @tracked hasDPO = this.args.changeset.hasDPO ?? false;
  @tracked hasExternalDPO = this.args.changeset.hasExternalDPO ?? false;

  toggleDPO = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.hasDPO = target.checked;
    this.args.changeset.set('hasDPO', this.hasDPO);
    if (!this.hasDPO) {
      this.args.changeset.set('DPO', undefined);
    }
  };

  toggleExternalDPO = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.hasExternalDPO = target.checked;
    this.args.changeset.set('hasExternalDPO', this.hasExternalDPO);
    if (!this.hasExternalDPO) {
      this.args.changeset.set('externalOrganizationDPO', undefined);
    }
  };

  <template>
    <div class="space-y-6" ...attributes>
      <div>
        <h2 class="text-2xl font-semibold mb-4">
          {{t "treatments.wizard.step2.title"}}
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {{! Left Panel - Responsible Entity }}
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.wizard.step2.sections.responsible"}}
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            {{t "treatments.wizard.step2.notes.responsibleNotEditable"}}
          </p>

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.responsible.fullName"}}
            @validationField="responsible.fullName"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.responsible.entityNumber"}}
            @validationField="responsible.entityNumber"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.address.streetAndNumber"}}
            @validationField="responsible.address.streetAndNumber"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.address.postalCode"}}
            @validationField="responsible.address.postalCode"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.address.city"}}
            @validationField="responsible.address.city"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.address.country"}}
            @validationField="responsible.address.country"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.wizard.step2.labels.address.phone"}}
            @validationField="responsible.address.phone"
            class="w-full"
          />

          <@form.TpkEmailPrefab
            @label={{t "treatments.wizard.step2.labels.address.email"}}
            @validationField="responsible.address.email"
            class="w-full"
          />
        </div>

        {{! Center Panel - DPO }}
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.wizard.step2.sections.dpo"}}
          </h3>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={{this.hasDPO}}
                {{on "change" this.toggleDPO}}
                class="checkbox"
              />
              <span class="label-text">
                {{t "treatments.wizard.step2.labels.hasDPO"}}
              </span>
            </label>
          </div>

          {{#if this.hasDPO}}
            <div class="space-y-4 mt-4">
              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.dpo.fullName"}}
                @validationField="DPO.fullName"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.streetAndNumber"}}
                @validationField="DPO.address.streetAndNumber"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.postalCode"}}
                @validationField="DPO.address.postalCode"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.city"}}
                @validationField="DPO.address.city"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.country"}}
                @validationField="DPO.address.country"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.phone"}}
                @validationField="DPO.address.phone"
                class="w-full"
              />

              <@form.TpkEmailPrefab
                @label={{t "treatments.wizard.step2.labels.address.email"}}
                @validationField="DPO.address.email"
                class="w-full"
              />
            </div>
          {{/if}}
        </div>

        {{! Right Panel - External DPO }}
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.wizard.step2.sections.externalDPO"}}
          </h3>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={{this.hasExternalDPO}}
                {{on "change" this.toggleExternalDPO}}
                class="checkbox"
              />
              <span class="label-text">
                {{t "treatments.wizard.step2.labels.hasExternalDPO"}}
              </span>
            </label>
          </div>

          {{#if this.hasExternalDPO}}
            <div class="space-y-4 mt-4">
              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.externalDPO.fullName"}}
                @validationField="externalOrganizationDPO.fullName"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.externalDPO.entityNumber"}}
                @validationField="externalOrganizationDPO.entityNumber"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.streetAndNumber"}}
                @validationField="externalOrganizationDPO.address.streetAndNumber"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.postalCode"}}
                @validationField="externalOrganizationDPO.address.postalCode"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.city"}}
                @validationField="externalOrganizationDPO.address.city"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.country"}}
                @validationField="externalOrganizationDPO.address.country"
                class="w-full"
              />

              <@form.TpkInputPrefab
                @label={{t "treatments.wizard.step2.labels.address.phone"}}
                @validationField="externalOrganizationDPO.address.phone"
                class="w-full"
              />

              <@form.TpkEmailPrefab
                @label={{t "treatments.wizard.step2.labels.address.email"}}
                @validationField="externalOrganizationDPO.address.email"
                class="w-full"
              />
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
