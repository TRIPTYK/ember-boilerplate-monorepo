import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';
import type { TreatmentData } from '#src/schemas/treatments.ts';

interface PurposesSignature {
  Args: { data: TreatmentData };
}

export default class Purposes extends Component<PurposesSignature> {
  get reasonsText(): string {
    return (this.args.data.reasons ?? []).join(', ');
  }

  get subReasonsIndexed(): Array<{
    index: number;
    name?: string;
    additionalInformation?: string;
  }> {
    return (this.args.data.subReasons ?? []).map((r, i) => ({
      index: i + 1,
      ...r,
    }));
  }

  get hasFinalites(): boolean {
    return (this.args.data.reasons ?? []).length > 0;
  }

  <template>
    {{#if this.hasFinalites}}
      <ViewLayout @title="treatments.details.purposes">
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
                      {{sub.name}}
                      :
                      {{sub.additionalInformation}}
                    {{else}}
                      {{sub.name}}
                    {{/if}}
                  </td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
      </ViewLayout>
    {{/if}}
  </template>
}
