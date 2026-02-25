import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';
import type { TreatmentData } from '#src/schemas/treatments.ts';

interface DataSharingSignature {
  Args: { data: TreatmentData };
}

export default class DataSharing extends Component<DataSharingSignature> {
  get dataAccessIndexed(): Array<{
    index: number;
    name: string;
    additionalInformation?: string;
  }> {
    return (this.args.data.dataAccess ?? []).map((r, i) => ({
      index: i + 1,
      ...r,
    }));
  }

  get sharedDataIndexed(): Array<{
    index: number;
    name: string;
    additionalInformation?: string;
  }> {
    return (this.args.data.sharedData ?? []).map((r, i) => ({
      index: i + 1,
      ...r,
    }));
  }

  get hasDataSharing(): boolean {
    return (
      (this.args.data.dataAccess ?? []).length > 0 ||
      (this.args.data.sharedData ?? []).length > 0
    );
  }

  <template>
    {{#if this.hasDataSharing}}
      <ViewLayout @title="treatments.details.dataSharing">
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
                    {{t
                      "treatments.details.recipientExternal"
                      index=item.index
                    }}
                  </td>
                  <td>{{item.name}}</td>
                  <td>{{item.additionalInformation}}</td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
      </ViewLayout>
    {{/if}}
  </template>
}
