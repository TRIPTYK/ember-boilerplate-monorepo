import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';
import type { TreatmentData } from '#src/schemas/treatments.ts';

interface GeneralInfoSignature {
  Args: { data: TreatmentData };
}

export default class GeneralInfo extends Component<GeneralInfoSignature> {
  get hasEntityNumber(): boolean {
    return (
      !!this.args.data.responsible?.entityNumber ||
      !!this.args.data.externalOrganizationDPO?.entityNumber
    );
  }

  <template>
    <ViewLayout @title="treatments.details.generalInfo">
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
            <tr>
              <td class="text-right border-r border-base-300 font-medium">
                {{t "treatments.details.responsible"}}
              </td>
              <td>{{@data.responsible.fullName}}</td>
              {{#if this.hasEntityNumber}}
                <td>{{@data.responsible.entityNumber}}</td>
              {{/if}}
              <td>{{@data.responsible.address.streetAndNumber}}</td>
              <td>{{@data.responsible.address.postalCode}}</td>
              <td>{{@data.responsible.address.city}}</td>
              <td>{{@data.responsible.address.country}}</td>
              <td>{{@data.responsible.address.phone}}</td>
              <td>{{@data.responsible.address.email}}</td>
            </tr>
            <tr>
              <td class="text-right border-r border-base-300 font-medium">
                {{t "treatments.details.dpo"}}
              </td>
              {{#if @data.hasDPO}}
                <td>{{@data.DPO.fullName}}</td>
                {{#if this.hasEntityNumber}}
                  <td></td>
                {{/if}}
                <td>{{@data.DPO.address.streetAndNumber}}</td>
                <td>{{@data.DPO.address.postalCode}}</td>
                <td>{{@data.DPO.address.city}}</td>
                <td>{{@data.DPO.address.country}}</td>
                <td>{{@data.DPO.address.phone}}</td>
                <td>{{@data.DPO.address.email}}</td>
              {{else}}
                <td
                  colspan={{if this.hasEntityNumber "8" "7"}}
                  class="text-base-content/50 italic"
                >
                  {{t "treatments.details.notApplicable"}}
                </td>
              {{/if}}
            </tr>
            {{#if @data.hasExternalDPO}}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{t "treatments.details.dpoExternalOrganization"}}
                </td>
                <td>{{@data.externalOrganizationDPO.fullName}}</td>
                {{#if this.hasEntityNumber}}
                  <td>{{@data.externalOrganizationDPO.entityNumber}}</td>
                {{/if}}
                <td>{{@data.externalOrganizationDPO.address.streetAndNumber}}</td>
                <td>{{@data.externalOrganizationDPO.address.postalCode}}</td>
                <td>{{@data.externalOrganizationDPO.address.city}}</td>
                <td>{{@data.externalOrganizationDPO.address.country}}</td>
                <td>{{@data.externalOrganizationDPO.address.phone}}</td>
                <td>{{@data.externalOrganizationDPO.address.email}}</td>
              </tr>
            {{/if}}
          </tbody>
        </table>
      </div>
    </ViewLayout>
  </template>
}
