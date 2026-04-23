import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { t, type IntlService } from 'ember-intl';
// @ts-expect-error missing types
import YetiTable from '@triptyk/ember-yeti-table/components/yeti-table';
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
import TpkButton from '@triptyk/ember-input/components/tpk-button';
import type SettingService from '#src/services/setting.ts';
import type { SettingItem, SettingItemKey } from '#src/schemas/settings.ts';
import SettingFormModal from '#src/components/settings/setting-form-modal.gts';
import EditIcon from '#src/assets/icons/edit.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import YetiTableFooter from '#src/components/tables/ui/yeti-table-footer.gts';

const TABLE_KEYS: SettingItemKey[] = [
  'customTreatmentTypes',
  'customReasons',
  'customCategories',
  'customPersonalData',
  'customEconomicInformation',
  'customDataSources',
  'customLegalBase',
  'customDataAccess',
  'customSharedData',
  'customSharedDataAccess',
  'customMeasures',
];

type Row = {
  id: string;
  key: SettingItemKey;
  name: string;
  typeLabel: string;
};

export default class SettingTable extends Component {
  @service declare setting: SettingService;
  @service declare intl: IntlService;

  @tracked items: SettingItem[] = [];
  @tracked isLoading = true;
  @tracked typeFilter: SettingItemKey | '' = '';
  @tracked isFormModalOpen = false;
  @tracked isDeleteModalOpen = false;
  @tracked editingItem: Row | null = null;

  constructor(owner: Owner, args: Record<string, never>) {
    super(owner, args);
    void this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    this.isLoading = true;
    try {
      this.items = await this.setting.findAll();
    } finally {
      this.isLoading = false;
    }
  }

  private typeLabel(key: SettingItemKey): string {
    return this.intl.t(`settings.types.${key}`);
  }

  get rows(): Row[] {
    return this.items
      .filter((s) => TABLE_KEYS.includes(s.key))
      .map((s) => ({
        id: s.id,
        key: s.key,
        name: s.name,
        typeLabel: this.typeLabel(s.key),
      }));
  }

  get typeKeyOptions(): Array<{ key: SettingItemKey; label: string }> {
    return TABLE_KEYS.map((key) => ({ key, label: this.typeLabel(key) }));
  }

  get filteredRowsCount(): number {
    if (!this.typeFilter) return this.rows.length;
    return this.rows.filter((r) => r.key === this.typeFilter).length;
  }

  get hasNoRows(): boolean {
    return !this.isLoading && this.filteredRowsCount === 0;
  }

  get deleteModalTitle(): string {
    return this.intl.t('settings.deleteModal.title');
  }

  // Custom filter: applied on each row against the current typeFilter value.
  // Yeti Table recomputes when @filterUsing changes.
  filterByType = (row: Row, filterUsing: SettingItemKey | ''): boolean => {
    if (!filterUsing) return true;
    return row.key === filterUsing;
  };

  @action
  setTypeFilter(e: Event): void {
    this.typeFilter = (e.target as HTMLSelectElement).value as
      | SettingItemKey
      | '';
  }

  @action
  openAdd(): void {
    this.editingItem = null;
    this.isFormModalOpen = true;
  }

  @action
  openEdit(row: Row): void {
    this.editingItem = row;
    this.isFormModalOpen = true;
  }

  @action
  openDelete(row: Row): void {
    this.editingItem = row;
    this.isDeleteModalOpen = true;
  }

  @action
  closeForm(): void {
    this.isFormModalOpen = false;
  }

  @action
  closeDelete(): void {
    this.isDeleteModalOpen = false;
    this.editingItem = null;
  }

  @action
  async saveItem(data: {
    key: SettingItemKey;
    name: string;
    id?: string;
  }): Promise<void> {
    if (data.id) {
      await this.setting.update(data.id, data.name);
    } else {
      await this.setting.create(data.key, data.name);
    }
    await this.loadSettings();
    this.isFormModalOpen = false;
  }

  @action
  async deleteItem(): Promise<void> {
    if (!this.editingItem) return;
    await this.setting.delete(this.editingItem.id);
    await this.loadSettings();
    this.isDeleteModalOpen = false;
    this.editingItem = null;
  }

  <template>
    <div class="flex flex-col gap-4" ...attributes>

      {{! Filter + Add button }}
      <div class="flex items-center justify-between gap-4 flex-wrap">
        {{! template-lint-disable require-input-label }}
        <select
          class="select select-bordered"
          value={{this.typeFilter}}
          {{on "change" this.setTypeFilter}}
        >
          <option value="">{{t "settings.table.filterAll"}}</option>
          {{#each this.typeKeyOptions as |opt|}}
            <option value={{opt.key}}>{{opt.label}}</option>
          {{/each}}
        </select>
        <TpkButton
          @onClick={{this.openAdd}}
          @label={{t "settings.table.addButton"}}
          class="btn btn-primary"
        >
          {{t "settings.table.addButton"}}
        </TpkButton>
      </div>

      {{! YetiTable — client-side data, pagination, sort and custom filter }}
      {{#if this.isLoading}}
        <div class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {{else}}
        <div class="overflow-x-auto rounded-lg border border-base-300">
          <YetiTable
            @data={{this.rows}}
            @pagination={{true}}
            @pageSize={{25}}
            @filterFunction={{this.filterByType}}
            @filterUsing={{this.typeFilter}}
            class="table table-zebra w-full"
            as |table|
          >
            <table.header as |header|>
              <header.column @prop="typeLabel">
                {{t "settings.table.headers.type"}}
              </header.column>
              <header.column @prop="name">
                {{t "settings.table.headers.name"}}
              </header.column>
              <header.column @sortable={{false}}>
                {{t "settings.table.headers.actions"}}
              </header.column>
            </table.header>

            <table.body as |body row|>
              <body.row as |r|>
                <r.cell>
                  <span
                    class="text-primary font-bold text-xs tracking-wide uppercase"
                  >
                    {{row.typeLabel}}
                  </span>
                </r.cell>
                <r.cell class="max-w-xs">
                  <span class="truncate block">{{row.name}}</span>
                </r.cell>
                <r.cell class="text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    aria-label={{t "settings.table.actions.edit"}}
                    {{on "click" (fn this.openEdit row)}}
                  >
                    <EditIcon class="size-4" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs text-error"
                    aria-label={{t "settings.table.actions.delete"}}
                    {{on "click" (fn this.openDelete row)}}
                  >
                    <DeleteIcon class="size-4" />
                  </button>
                </r.cell>
              </body.row>
            </table.body>

            <YetiTableFooter
              @paginationData={{table.paginationData}}
              @actions={{table.actions}}
              @visibleColumnsCount={{table.visibleColumns.length}}
            />
          </YetiTable>

          {{#if this.hasNoRows}}
            <div class="text-center py-8 text-base-content/50">
              {{t "settings.table.empty"}}
            </div>
          {{/if}}
        </div>
      {{/if}}

      {{! Create / edit modal — recreated each open to reset local state }}
      {{#if this.isFormModalOpen}}
        <SettingFormModal
          @onClose={{this.closeForm}}
          @onSave={{this.saveItem}}
          @editingItem={{this.editingItem}}
        />
      {{/if}}

      {{! Delete confirmation modal }}
      <TpkModal
        @isOpen={{this.isDeleteModalOpen}}
        @onClose={{this.closeDelete}}
        @title={{this.deleteModalTitle}}
        as |M|
      >
        <M.Content>
          <p class="text-base-content mt-3">
            {{t "settings.deleteModal.confirm" name=this.editingItem.name}}
          </p>
          <div
            class="flex justify-end gap-2 mt-6 pt-4 border-t border-base-300"
          >
            <TpkButton
              @onClick={{this.closeDelete}}
              @label={{t "settings.deleteModal.cancel"}}
              class="btn btn-ghost"
            >
              {{t "settings.deleteModal.cancel"}}
            </TpkButton>
            <TpkButton
              @onClick={{this.deleteItem}}
              @label={{t "settings.deleteModal.delete"}}
              class="btn btn-error"
            >
              {{t "settings.deleteModal.delete"}}
            </TpkButton>
          </div>
        </M.Content>
      </TpkModal>
    </div>
  </template>
}
