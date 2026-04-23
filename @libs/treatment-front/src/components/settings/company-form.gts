import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import { t, type IntlService } from 'ember-intl';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import type CompanyService from '#src/services/company.ts';
import type { CompanyType } from '#src/services/company.ts';
import {
  CompanyChangeset,
  type DraftCompany,
} from '#src/changesets/company.ts';
import { companySchema } from '#src/components/settings/company-validation.ts';

export default class CompanyForm extends Component {
  @service declare company: CompanyService;
  @service declare intl: IntlService;

  @tracked changeset: CompanyChangeset | null = null;
  @tracked isLoading = true;
  @tracked isSaving = false;
  @tracked saved = false;

  constructor(owner: Owner, args: Record<string, never>) {
    super(owner, args);
    void this.load();
  }

  async load(): Promise<void> {
    try {
      const data = await this.company.load();
      this.changeset = new CompanyChangeset(data as DraftCompany);
    } finally {
      this.isLoading = false;
    }
  }

  get validationSchema() {
    return companySchema(this.intl);
  }

  get hasDPO(): boolean {
    return this.changeset?.get('hasDPO') ?? false;
  }

  get hasExternalDPO(): boolean {
    return this.changeset?.get('hasExternalDPO') ?? false;
  }

  get submitLabel(): string {
    return this.isSaving
      ? this.intl.t('settings.company.common.saving')
      : this.intl.t('settings.company.common.save');
  }

  @action
  async handleSubmit(): Promise<void> {
    if (!this.changeset || this.isSaving) return;
    this.isSaving = true;
    this.saved = false;
    try {
      const data = this.changeset.data as CompanyType;
      const saved = await this.company.save(data);
      this.changeset = new CompanyChangeset(saved as DraftCompany);
      this.saved = true;
    } finally {
      this.isSaving = false;
    }
  }

  <template>
    {{#if this.isLoading}}
      <div class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {{else if this.changeset}}
      <TpkForm
        @changeset={{this.changeset}}
        @validationSchema={{this.validationSchema}}
        @onSubmit={{this.handleSubmit}}
        as |F|
      >
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl">

          {{! ── Section 1 : Entité responsable ──────────────────────── }}
          <section class="card bg-base-100 shadow p-4 flex flex-col">
            <h5 class="font-semibold text-base-content text-lg">
              {{t "settings.company.entity.title"}}
            </h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <F.TpkInputPrefab
                @label={{t "settings.company.entity.fullName"}}
                @validationField="responsible.fullName"
                class="w-full"
              />
              <F.TpkInputPrefab
                @label={{t "settings.company.entity.entityNumber"}}
                @validationField="responsible.entityNumber"
                class="w-full"
              />
            </div>

            <h6 class="font-semibold text-sm border-t border-base-300 pt-2">
              {{t "settings.company.address.title"}}
            </h6>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <F.TpkInputPrefab
                @label={{t "settings.company.address.street"}}
                @validationField="responsible.address.streetAndNumber"
                class="w-full md:col-span-2"
              />
              <F.TpkInputPrefab
                @label={{t "settings.company.address.postalCode"}}
                @validationField="responsible.address.postalCode"
                class="w-full"
              />
              <F.TpkInputPrefab
                @label={{t "settings.company.address.city"}}
                @validationField="responsible.address.city"
                class="w-full"
              />
              <F.TpkInputPrefab
                @label={{t "settings.company.address.country"}}
                @validationField="responsible.address.country"
                class="w-full md:col-span-2"
              />
              <F.TpkInputPrefab
                @label={{t "settings.company.address.phone"}}
                @validationField="responsible.address.phone"
                class="w-full"
              />
              <F.TpkEmailPrefab
                @label={{t "settings.company.address.email"}}
                @validationField="responsible.address.email"
                class="w-full"
              />
            </div>
          </section>

          {{! ── Section 2 : DPO interne ─────────────────────────────── }}
          <section class="card bg-base-100 shadow p-4 flex flex-col">
            <h5 class="font-semibold text-base-content text-lg">
              {{t "settings.company.internalDpo.title"}}
            </h5>
            <F.TpkCheckboxPrefab
              @label={{t "settings.company.internalDpo.enable"}}
              @validationField="hasDPO"
              class="flex! justify-between w-full"
            />

            {{#if this.hasDPO}}
              <F.TpkInputPrefab
                @label={{t "settings.company.internalDpo.fullName"}}
                @validationField="DPO.fullName"
                class="w-full"
              />

              <h6 class="font-semibold text-sm border-t border-base-300 pt-2">
                {{t "settings.company.address.title"}}
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.street"}}
                  @validationField="DPO.address.streetAndNumber"
                  class="w-full md:col-span-2"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.postalCode"}}
                  @validationField="DPO.address.postalCode"
                  class="w-full"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.city"}}
                  @validationField="DPO.address.city"
                  class="w-full"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.country"}}
                  @validationField="DPO.address.country"
                  class="w-full md:col-span-2"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.phone"}}
                  @validationField="DPO.address.phone"
                  class="w-full"
                />
                <F.TpkEmailPrefab
                  @label={{t "settings.company.address.email"}}
                  @validationField="DPO.address.email"
                  class="w-full"
                />
              </div>
            {{/if}}
          </section>

          {{! ── Section 3 : DPO externe ─────────────────────────────── }}
          <section class="card bg-base-100 shadow p-4 flex flex-col">
            <h5 class="font-semibold text-base-content text-lg">
              {{t "settings.company.externalDpo.title"}}
            </h5>
            <F.TpkCheckboxPrefab
              @label={{t "settings.company.externalDpo.enable"}}
              @validationField="hasExternalDPO"
              class="flex! justify-between w-full"
            />

            {{#if this.hasExternalDPO}}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <F.TpkInputPrefab
                  @label={{t "settings.company.externalDpo.fullName"}}
                  @validationField="externalOrganizationDPO.fullName"
                  class="w-full"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.externalDpo.entityNumber"}}
                  @validationField="externalOrganizationDPO.entityNumber"
                  class="w-full"
                />
              </div>

              <h6 class="font-semibold text-sm border-t border-base-300 pt-2">
                {{t "settings.company.address.title"}}
              </h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.street"}}
                  @validationField="externalOrganizationDPO.address.streetAndNumber"
                  class="w-full md:col-span-2"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.postalCode"}}
                  @validationField="externalOrganizationDPO.address.postalCode"
                  class="w-full"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.city"}}
                  @validationField="externalOrganizationDPO.address.city"
                  class="w-full"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.country"}}
                  @validationField="externalOrganizationDPO.address.country"
                  class="w-full md:col-span-2"
                />
                <F.TpkInputPrefab
                  @label={{t "settings.company.address.phone"}}
                  @validationField="externalOrganizationDPO.address.phone"
                  class="w-full"
                />
                <F.TpkEmailPrefab
                  @label={{t "settings.company.address.email"}}
                  @validationField="externalOrganizationDPO.address.email"
                  class="w-full"
                />
              </div>
            {{/if}}
          </section>

          {{! ── Footer : bouton global ──────────────────────────────── }}
          <div class="flex items-center gap-4 justify-end lg:col-span-3">
            {{#if this.saved}}
              <span class="text-success text-sm font-medium">
                {{t "settings.company.common.saved"}}
              </span>
            {{/if}}
            <button
              type="submit"
              class="btn btn-primary"
              disabled={{this.isSaving}}
            >
              {{this.submitLabel}}
            </button>
          </div>
        </div>
      </TpkForm>
    {{/if}}
  </template>
}
