import type { TOC } from '@ember/component/template-only';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';
import type { TreatmentData } from '#src/schemas/treatments.ts';

interface EuTransfersSignature {
  Args: { data: TreatmentData };
}

const EuTransfers: TOC<EuTransfersSignature> = <template>
  {{#if @data.areDataExportedOutsideEU}}
    <ViewLayout @title="treatments.details.dataTransfers">
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
              <td>{{@data.recipient.fullName}}</td>
              <td>{{@data.recipient.country}}</td>
              <td>{{@data.recipient.guaranteeTypes}}</td>
              <td>
                {{#if @data.recipient.linkToDoc}}
                  <a
                    href={{@data.recipient.linkToDoc}}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link link-primary"
                  >
                    {{@data.recipient.linkToDoc}}
                  </a>
                {{/if}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ViewLayout>
  {{/if}}
</template>;

export default EuTransfers;
