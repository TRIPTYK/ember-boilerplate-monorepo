import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';

export type YetiPaginationData = {
  pageSize: number;
  pageNumber: number;
  pageStart: number;
  pageEnd: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  totalRows: number;
  totalPages: number;
};

export type YetiTableActions = {
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  reloadData: () => Promise<void>;
};

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

interface YetiTableFooterSignature {
  Args: {
    paginationData: YetiPaginationData;
    actions: YetiTableActions;
    visibleColumnsCount: number;
    pageSizes?: number[];
  };
  Element: HTMLTableSectionElement;
}

export default class YetiTableFooter extends Component<YetiTableFooterSignature> {
  get pageSizes(): number[] {
    return this.args.pageSizes ?? DEFAULT_PAGE_SIZES;
  }

  @action
  onChangePageSize(e: Event): void {
    const size = parseInt((e.target as HTMLSelectElement).value, 10);
    this.args.actions.changePageSize(size);
  }

  <template>
    <tfoot ...attributes>
      <tr>
        <td colspan={{@visibleColumnsCount}}>
          <div class="flex items-center justify-between gap-4 flex-wrap p-2">
            <div class="text-sm text-base-content/60">
              {{t
                "settings.table.pagination.showing"
                start=@paginationData.pageStart
                end=@paginationData.pageEnd
                total=@paginationData.totalRows
              }}
            </div>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="text-sm">
                  {{t "settings.table.pagination.rowsPerPage"}}
                </span>
                {{! template-lint-disable require-input-label }}
                <select
                  class="select select-bordered select-sm"
                  value={{@paginationData.pageSize}}
                  {{on "change" this.onChangePageSize}}
                >
                  {{#each this.pageSizes as |size|}}
                    <option value={{size}}>{{size}}</option>
                  {{/each}}
                </select>
              </div>
              <div class="join">
                <button
                  type="button"
                  class="btn btn-sm join-item"
                  disabled={{@paginationData.isFirstPage}}
                  {{on "click" @actions.previousPage}}
                >
                  {{t "settings.table.pagination.previous"}}
                </button>
                <button type="button" class="btn btn-sm join-item btn-disabled">
                  {{@paginationData.pageNumber}}
                  /
                  {{@paginationData.totalPages}}
                </button>
                <button
                  type="button"
                  class="btn btn-sm join-item"
                  disabled={{@paginationData.isLastPage}}
                  {{on "click" @actions.nextPage}}
                >
                  {{t "settings.table.pagination.next"}}
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </template>
}
