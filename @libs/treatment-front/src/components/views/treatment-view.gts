import Component from '@glimmer/component';
import { t } from 'ember-intl';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';
import type { Treatment, TreatmentData, TreatmentStatus } from '#src/schemas/treatments.ts';

interface TreatmentViewSignature {
  Args: {
    treatment: Treatment & { id: string };
    onBack: () => void;
    onEdit: () => void;
  };
}

export default class TreatmentView extends Component<TreatmentViewSignature> {
  get data(): TreatmentData {
    return this.args.treatment.data;
  }

  get formattedCreationDate(): string {
    const d = this.args.treatment.creationDate;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('fr-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  get formattedUpdateDate(): string {
    const d = this.args.treatment.updateDate;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('fr-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  get hasEntityNumber(): boolean {
    return (
      !!this.data.responsible?.entityNumber ||
      !!this.data.externalOrganizationDPO?.entityNumber
    );
  }

  get statusBadgeClass(): string {
    const map: Record<TreatmentStatus, string> = {
      draft: 'badge badge-sm badge-warning',
      validated: 'badge badge-sm badge-success',
      archived: 'badge badge-sm badge-ghost',
    };
    return map[this.args.treatment.status] ?? 'badge badge-sm badge-ghost';
  }

  get statusTranslationKey(): string {
    return `treatments.table.advanced.status.${this.args.treatment.status}`;
  }

  get subjectCategoriesRows(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    const categories = this.data.dataSubjectCategories ?? [];
    const precisions = this.data.subjectCategoryPrecisions ?? [];
    return categories.map((name) => {
      const found = precisions.find((p) => p.name === name);
      return { name, additionalInformation: found?.additionalInformation };
    });
  }

  get personalDataItems(): Array<{ name: string; isSensitive: boolean }> {
    return this.data.personalDataGroup?.data.name ?? [];
  }

  get financialDataItems(): Array<{ name: string; isSensitive: boolean }> {
    return this.data.financialDataGroup?.data.name ?? [];
  }

  get dataAccessItems(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    return this.data.dataAccess ?? [];
  }

  get sharedDataItems(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    return this.data.sharedData ?? [];
  }

  get hasDataSharing(): boolean {
    return this.dataAccessItems.length > 0 || this.sharedDataItems.length > 0;
  }

  get securitySetupItems(): Array<{
    name: string;
    additionalInformation?: string;
  }> {
    return this.data.securitySetup ?? [];
  }

  get legalBaseItems(): Array<{
    name?: string;
    additionalInformation?: string;
  }> {
    return this.data.legalBase ?? [];
  }

  get reasonsText(): string {
    return (this.data.reasons ?? []).join(', ');
  }

  get subReasonsIndexed(): Array<{
    index: number;
    name?: string;
    additionalInformation?: string;
  }> {
    return (this.data.subReasons ?? []).map((r, i) => ({ index: i + 1, ...r }));
  }

  get dataAccessIndexed(): Array<{
    index: number;
    name: string;
    additionalInformation?: string;
  }> {
    return (this.data.dataAccess ?? []).map((r, i) => ({ index: i + 1, ...r }));
  }

  get sharedDataIndexed(): Array<{
    index: number;
    name: string;
    additionalInformation?: string;
  }> {
    return (this.data.sharedData ?? []).map((r, i) => ({ index: i + 1, ...r }));
  }

  get hasFinalites(): boolean {
    return (this.data.reasons ?? []).length > 0;
  }

  <template>
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">

      {{! ── Header actions ─────────────────────────────────────── }}
      <div class="flex justify-between items-center">
        <TpkButtonComponent
          @label={{t "treatments.details.back"}}
          @onClick={{@onBack}}
          class="btn btn-ghost gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{t "treatments.details.back"}}
        </TpkButtonComponent>
        <TpkButtonComponent
          @label={{t "treatments.details.edit"}}
          @onClick={{@onEdit}}
          class="btn btn-primary gap-2"
        >
          {{t "treatments.details.edit"}}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </TpkButtonComponent>
      </div>

      {{! ── Section 1 : En-tête traitement ─────────────────────── }}
      <div class="card bg-base-100 shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-primary">
              {{t "treatments.details.title"}}
            </span>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-2xl font-bold text-base-content">
                {{this.data.title}}
              </span>
              <span class={{this.statusBadgeClass}}>
                {{t this.statusTranslationKey}}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-primary">
              {{t "treatments.details.creationDate"}}
            </span>
            <span class="text-2xl font-bold text-base-content">
              {{this.formattedCreationDate}}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-primary">
              {{t "treatments.details.updateDate"}}
            </span>
            <span class="text-2xl font-bold text-base-content">
              {{this.formattedUpdateDate}}
            </span>
          </div>
        </div>
      </div>

      {{! ── Section 2 : Informations générales ────────────────── }}
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <span class="text-primary font-bold text-sm tracking-widest uppercase">
            {{t "treatments.details.generalInfo"}}
          </span>
          <div class="flex-1 border-t border-base-300"></div>
        </div>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr class="text-primary text-xs uppercase tracking-wide">
                <th class="w-[210px] text-right border-r border-base-300">
                  {{t "treatments.details.actors"}}
                </th>
                <th>{{t "treatments.details.fullName"}}</th>
                {{#if this.hasEntityNumber}}
                  <th>{{t "treatments.details.entityNumber"}}</th>
                {{/if}}
                <th>{{t "treatments.details.address"}}</th>
                <th>{{t "treatments.details.postalCode"}}</th>
                <th>{{t "treatments.details.city"}}</th>
                <th>{{t "treatments.details.country"}}</th>
                <th>{{t "treatments.details.phone"}}</th>
                <th>{{t "treatments.details.email"}}</th>
              </tr>
            </thead>
            <tbody>
              {{! Responsable du traitement }}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{t "treatments.details.responsible"}}
                </td>
                <td>{{this.data.responsible.fullName}}</td>
                {{#if this.hasEntityNumber}}
                  <td>{{this.data.responsible.entityNumber}}</td>
                {{/if}}
                <td>{{this.data.responsible.address.streetAndNumber}}</td>
                <td>{{this.data.responsible.address.postalCode}}</td>
                <td>{{this.data.responsible.address.city}}</td>
                <td>{{this.data.responsible.address.country}}</td>
                <td>{{this.data.responsible.address.phone}}</td>
                <td>{{this.data.responsible.address.email}}</td>
              </tr>
              {{! DPO }}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{t "treatments.details.dpo"}}
                </td>
                {{#if this.data.hasDPO}}
                  <td>{{this.data.DPO.fullName}}</td>
                  {{#if this.hasEntityNumber}}
                    <td></td>
                  {{/if}}
                  <td>{{this.data.DPO.address.streetAndNumber}}</td>
                  <td>{{this.data.DPO.address.postalCode}}</td>
                  <td>{{this.data.DPO.address.city}}</td>
                  <td>{{this.data.DPO.address.country}}</td>
                  <td>{{this.data.DPO.address.phone}}</td>
                  <td>{{this.data.DPO.address.email}}</td>
                {{else}}
                  <td colspan={{if this.hasEntityNumber "8" "7"}} class="text-base-content/50 italic">
                    {{t "treatments.details.notApplicable"}}
                  </td>
                {{/if}}
              </tr>
              {{! Société du DPO }}
              {{#if this.data.hasExternalDPO}}
                <tr>
                  <td class="text-right border-r border-base-300 font-medium">
                    {{t "treatments.details.dpoExternalOrganization"}}
                  </td>
                  <td>{{this.data.externalOrganizationDPO.fullName}}</td>
                  {{#if this.hasEntityNumber}}
                    <td>{{this.data.externalOrganizationDPO.entityNumber}}</td>
                  {{/if}}
                  <td>{{this.data.externalOrganizationDPO.address.streetAndNumber}}</td>
                  <td>{{this.data.externalOrganizationDPO.address.postalCode}}</td>
                  <td>{{this.data.externalOrganizationDPO.address.city}}</td>
                  <td>{{this.data.externalOrganizationDPO.address.country}}</td>
                  <td>{{this.data.externalOrganizationDPO.address.phone}}</td>
                  <td>{{this.data.externalOrganizationDPO.address.email}}</td>
                </tr>
              {{/if}}
            </tbody>
          </table>
        </div>
      </div>

      {{! ── Section 3 : Finalités ───────────────────────────────── }}
      {{#if this.hasFinalites}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.purposes"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th>{{t "treatments.details.additionalInfo"}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-right border-r border-base-300 font-medium">
                    {{t "treatments.details.mainPurpose"}}
                  </td>
                  <td>{{this.reasonsText}}</td>
                </tr>
                {{#each this.subReasonsIndexed as |sub|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">
                      {{t "treatments.details.subPurpose" index=sub.index}}
                    </td>
                    <td>
                      {{#if sub.additionalInformation}}
                        {{sub.name}} : {{sub.additionalInformation}}
                      {{else}}
                        {{sub.name}}
                      {{/if}}
                    </td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

      {{! ── Section 4a : Données personnelles ─────────────────── }}
      {{#if this.personalDataItems.length}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.personalData"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th class="text-center">{{t "treatments.details.isSensitive"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.personalDataItems as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">{{item.name}}</td>
                    <td class="text-center">
                      {{#if item.isSensitive}}
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-error mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      {{/if}}
                    </td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
          {{#if this.data.personalDataGroup.conservationDuration}}
            <p class="text-sm text-base-content/70 mt-1">
              {{t "treatments.details.conservationDuration" duration=this.data.personalDataGroup.conservationDuration}}
            </p>
          {{/if}}
        </div>
      {{/if}}

      {{! ── Section 4b : Données financières ──────────────────── }}
      {{#if this.financialDataItems.length}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.financialData"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th class="text-center">{{t "treatments.details.isSensitive"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.financialDataItems as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">{{item.name}}</td>
                    <td class="text-center">
                      {{#if item.isSensitive}}
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-error mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      {{/if}}
                    </td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
          {{#if this.data.financialDataGroup.conservationDuration}}
            <p class="text-sm text-base-content/70 mt-1">
              {{t "treatments.details.conservationDuration" duration=this.data.financialDataGroup.conservationDuration}}
            </p>
          {{/if}}
        </div>
      {{/if}}

      {{! ── Section 5 : Base légale ────────────────────────────── }}
      {{#if this.legalBaseItems.length}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.legalBase"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th>{{t "treatments.details.additionalInfo"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.legalBaseItems as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">{{item.name}}</td>
                    <td>{{item.additionalInformation}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

      {{! ── Section 6 : Catégories de personnes concernées ─────── }}
      {{#if this.subjectCategoriesRows.length}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.categories"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th>{{t "treatments.details.additionalInfo"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.subjectCategoriesRows as |row|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">{{row.name}}</td>
                    <td>{{row.additionalInformation}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

      {{! ── Section 7 : Partage des données ────────────────────── }}
      {{#if this.hasDataSharing}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.dataSharing"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.category"}}
                  </th>
                  <th>{{t "treatments.details.description"}}</th>
                  <th>{{t "treatments.details.additionalInfo"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.dataAccessIndexed as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">
                      {{t "treatments.details.recipient" index=item.index}}
                    </td>
                    <td>{{item.name}}</td>
                    <td>{{item.additionalInformation}}</td>
                  </tr>
                {{/each}}
                {{#each this.sharedDataIndexed as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">
                      {{t "treatments.details.recipientExternal" index=item.index}}
                    </td>
                    <td>{{item.name}}</td>
                    <td>{{item.additionalInformation}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

      {{! ── Section 8 : Mesures de sécurité ────────────────────── }}
      {{#if this.securitySetupItems.length}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.securityMeasures"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.description"}}
                  </th>
                  <th>{{t "treatments.details.additionalInfo"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each this.securitySetupItems as |item|}}
                  <tr>
                    <td class="text-right border-r border-base-300 font-medium">{{item.name}}</td>
                    <td>{{item.additionalInformation}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

      {{! ── Section 9 : Transferts hors UE ────────────────────── }}
      {{#if this.data.areDataExportedOutsideEU}}
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-sm tracking-widest uppercase">
              {{t "treatments.details.dataTransfers"}}
            </span>
            <div class="flex-1 border-t border-base-300"></div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr class="text-primary text-xs uppercase tracking-wide">
                  <th class="w-[210px] text-right border-r border-base-300">
                    {{t "treatments.details.actors"}}
                  </th>
                  <th>{{t "treatments.details.fullName"}}</th>
                  <th>{{t "treatments.details.recipientCountry"}}</th>
                  <th>{{t "treatments.details.guaranteeTypes"}}</th>
                  <th>{{t "treatments.details.linkToDoc"}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-right border-r border-base-300 font-medium">
                    {{t "treatments.details.EUTransferRecipient"}}
                  </td>
                  <td>{{this.data.recipient.fullName}}</td>
                  <td>{{this.data.recipient.country}}</td>
                  <td>{{this.data.recipient.guaranteeTypes}}</td>
                  <td>
                    {{#if this.data.recipient.linkToDoc}}
                      <a
                        href={{this.data.recipient.linkToDoc}}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link link-primary"
                      >
                        {{this.data.recipient.linkToDoc}}
                      </a>
                    {{/if}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      {{/if}}

    </div>
  </template>
}
