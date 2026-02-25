import type { TOC } from '@ember/component/template-only';
import { t } from 'ember-intl';
import ViewLayout from '#src/components/ui/view-layout.gts';

interface CategoriesSignature {
  Args: {
    rows: Array<{ name: string; additionalInformation?: string }>;
  };
}

const Categories: TOC<CategoriesSignature> = <template>
  {{#if @rows.length}}
    <ViewLayout @title="treatments.details.categories">
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
            {{#each @rows as |row|}}
              <tr>
                <td class="text-right border-r border-base-300 font-medium">
                  {{row.name}}
                </td>
                <td>{{row.additionalInformation}}</td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
    </ViewLayout>
  {{/if}}
</template>;

export default Categories;
