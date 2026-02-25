import type { TOC } from '@ember/component/template-only';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';

interface SecuritySignature {
  Args: {
    items: Array<{ name: string; additionalInformation?: string }>;
  };
}

const Security: TOC<SecuritySignature> = <template>
  {{#if @items.length}}
    <ViewLayout @title="treatments.details.securityMeasures">
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
            {{#each @items as |item|}}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{item.name}}
                </td>
                <td>{{item.additionalInformation}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
    </ViewLayout>
  {{/if}}
</template>;

export default Security;
