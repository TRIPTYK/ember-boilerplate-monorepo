import Component from '@glimmer/component';
import { t } from 'ember-intl';
import type { TreatmentChangeset } from '#src/changesets/treatment.ts';
import type Owner from '@ember/owner';
import type TpkValidationInputPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
import type TpkValidationEmailPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-email';
import type { WithBoundArgs } from '@glint/template';
import type TpkValidationCheckboxPrefabComponent from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-checkbox';

interface Step2GeneralInfoSignature {
  Args: {
    form: {
      TpkInputPrefab: WithBoundArgs<
        typeof TpkValidationInputPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
      TpkEmailPrefab: WithBoundArgs<
        typeof TpkValidationEmailPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
      TpkCheckboxPrefab: WithBoundArgs<
        typeof TpkValidationCheckboxPrefabComponent,
        'changeset' | 'disabled' | 'requiredFields'
      >;
    };
    changeset: TreatmentChangeset;
  };
  Element: HTMLDivElement;
}

export default class Step2GeneralInfo extends Component<Step2GeneralInfoSignature> {
  constructor(owner: Owner, args: Step2GeneralInfoSignature['Args']) {
    super(owner, args);
  }

  get hasDPO(): boolean {
    return this.args.changeset.get('hasDPO') ?? false;
  }

  get hasExternalDPO(): boolean {
    return this.args.changeset.get('hasExternalDPO') ?? false;
  }

  <template>
    <div class="space-y-6" ...attributes>
      <div>
        <h2 class="text-2xl font-semibold mb-4">
          {{t "treatments.form.step2.title"}}
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {{! Left Panel - Responsible Entity }}
        <div class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.form.step2.sections.responsible"}}
          </h3>

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.responsible.fullName"}}
            @validationField="responsible.fullName"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.responsible.entityNumber"}}
            @validationField="responsible.entityNumber"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.address.streetAndNumber"}}
            @validationField="responsible.address.streetAndNumber"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.address.postalCode"}}
            @validationField="responsible.address.postalCode"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.address.city"}}
            @validationField="responsible.address.city"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.address.country"}}
            @validationField="responsible.address.country"
            class="w-full"
          />

          <@form.TpkInputPrefab
            @label={{t "treatments.form.step2.labels.address.phone"}}
            @validationField="responsible.address.phone"
            class="w-full"
          />

          <@form.TpkEmailPrefab
            @label={{t "treatments.form.step2.labels.address.email"}}
            @validationField="responsible.address.email"
            class="w-full"
          />
        </div>

        <div class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.form.step2.sections.dpo"}}
          </h3>
          <@form.TpkCheckboxPrefab
            @label={{t "treatments.form.step2.labels.hasDPO"}}
            @validationField="hasDPO"
            class="flex! justify-between w-full"
          />
          {{#if this.hasDPO}}
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.dpo.fullName"}}
              @validationField="DPO.fullName"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t
                "treatments.form.step2.labels.address.streetAndNumber"
              }}
              @validationField="DPO.address.streetAndNumber"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.postalCode"}}
              @validationField="DPO.address.postalCode"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.city"}}
              @validationField="DPO.address.city"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.country"}}
              @validationField="DPO.address.country"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.phone"}}
              @validationField="DPO.address.phone"
              class="w-full"
            />

            <@form.TpkEmailPrefab
              @label={{t "treatments.form.step2.labels.address.email"}}
              @validationField="DPO.address.email"
              class="w-full"
            />
          {{/if}}
        </div>

        <div class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">
            {{t "treatments.form.step2.sections.externalDPO"}}
          </h3>
          <@form.TpkCheckboxPrefab
            @label={{t "treatments.form.step2.labels.hasExternalDPO"}}
            @validationField="hasExternalDPO"
            class="flex! justify-between w-full"
          />
          {{#if this.hasExternalDPO}}
            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.externalDPO.fullName"}}
              @validationField="externalOrganizationDPO.fullName"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t
                "treatments.form.step2.labels.externalDPO.entityNumber"
              }}
              @validationField="externalOrganizationDPO.entityNumber"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t
                "treatments.form.step2.labels.address.streetAndNumber"
              }}
              @validationField="externalOrganizationDPO.address.streetAndNumber"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.postalCode"}}
              @validationField="externalOrganizationDPO.address.postalCode"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.city"}}
              @validationField="externalOrganizationDPO.address.city"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.country"}}
              @validationField="externalOrganizationDPO.address.country"
              class="w-full"
            />

            <@form.TpkInputPrefab
              @label={{t "treatments.form.step2.labels.address.phone"}}
              @validationField="externalOrganizationDPO.address.phone"
              class="w-full"
            />

            <@form.TpkEmailPrefab
              @label={{t "treatments.form.step2.labels.address.email"}}
              @validationField="externalOrganizationDPO.address.email"
              class="w-full"
            />
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
