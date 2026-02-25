import type { TOC } from '@ember/component/template-only';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';

interface DataGroupSignature {
  Args: {
    title: string;
    items: Array<{ name: string; isSensitive: boolean }>;
    conservationDuration?: string;
  };
}

const DataGroup: TOC<DataGroupSignature> = <template>
  {{#if @items.length}}
    <ViewLayout @title={{@title}}>
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
            {{#each @items as |item|}}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{item.name}}
                </td>
                <td class="text-center">
                  {{#if item.isSensitive}}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 text-error mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  {{/if}}
                </td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
      {{#if @conservationDuration}}
        <p class="text-sm text-base-content/70 mt-1">
          {{t
            "treatments.details.conservationDuration"
            duration=@conservationDuration
          }}
        </p>
      {{/if}}
    </ViewLayout>
  {{/if}}
</template>;

export default DataGroup;
