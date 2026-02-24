import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import TpkSelect from '@triptyk/ember-input/components/tpk-select';
import TpkConfirmModalPrefab from '@triptyk/ember-ui/components/prefabs/tpk-confirm-modal-prefab';
import { t, type IntlService } from 'ember-intl';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import type TreatmentService from '#src/services/treatment.ts';
import type { Treatment, TreatmentWithId } from '#src/schemas/treatments.ts';
import StatusChip from '#src/components/tables/ui/status-chip.gts';
import SensitiveDataIndicator from '#src/components/tables/ui/sensitive-data-indicator.gts';
import TreatmentTypeEditor from '#src/components/tables/ui/treatment-type-editor.gts';
import { hash } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';
import ViewIcon from '#src/assets/icons/view.gts';
import EditIcon from '#src/assets/icons/edit.gts';
import ArchiveIcon from '#src/assets/icons/archive.gts';
import type { TableApi } from '@triptyk/ember-ui/components/tpk-table-generic/table';
import TpkTogglePrefabComponent from '@triptyk/ember-input/components/prefabs/tpk-toggle';

class TreatmentsTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare treatment: TreatmentService;
  @service declare flashMessages: FlashMessagesService;

  @tracked includeArchived = false;
  @tracked treatmentTypeFilter: string | null = null;
  @tracked selectedTreatmentForArchive: TreatmentWithId | null = null;
  @tracked tableApi: TableApi | null = null;
  hardcodedTreatmentTypes = ['RH', 'Marketing', 'Finance', 'IT', 'Juridique'];

  get isModalOpen(): boolean {
    return this.selectedTreatmentForArchive !== null;
  }

  get confirmQuestion(): string {
    if (!this.selectedTreatmentForArchive) return '';

    const action =
      this.selectedTreatmentForArchive.status === 'archived'
        ? 'unarchive'
        : 'archive';

    return this.intl.t(`treatments.table.confirmModal.${action}Question`, {
      title: this.selectedTreatmentForArchive.data.title || 'this treatment',
    });
  }

  get tableParams(): TableParams {
    return {
      entity: 'treatments',
      pageSizes: [10, 30, 50, 100],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.treatments.edit',
          (element as { id: string }).id
        );
      },
      additionalFilters: {
        treatmentType: this.treatmentTypeFilter ?? '',
        includeArchived: this.includeArchived ? 'true' : 'false',
      },
      registerApi: (api: TableApi) => {
        // eslint-disable-next-line ember/no-side-effects
        this.tableApi = api;
      },
      defaultSortColumn: 'order',
      columns: [
        {
          field: 'order',
          headerName: this.intl.t('treatments.table.advanced.headers.order'),
          sortable: false,
        },
        {
          field: 'data.title',
          headerName: this.intl.t('treatments.table.advanced.headers.title'),
          sortable: false,
        },
        {
          field: 'data.treatmentType',
          headerName: this.intl.t('treatments.table.advanced.headers.type'),
          sortable: false,
          component: 'typeEditor',
        },
        {
          field: 'data.reasons',
          headerName: this.intl.t('treatments.table.advanced.headers.reasons'),
          sortable: false,
          renderElement: (value: unknown) => {
            return (
              (value as { 'data.reasons'?: string[] })['data.reasons']?.join(
                ', '
              ) || '-'
            );
          },
        },
        {
          field: 'status',
          headerName: this.intl.t('treatments.table.advanced.headers.status'),
          sortable: false,
          component: 'statusChip',
        },
        {
          field: 'sensitiveData',
          headerName: this.intl.t(
            'treatments.table.advanced.headers.sensitiveData'
          ),
          sortable: false,
          component: 'sensitiveIndicator',
        },
        {
          field: 'creationDate',
          headerName: this.intl.t(
            'treatments.table.advanced.headers.creationDate'
          ),
          sortable: false,
          renderElement: (value: unknown) => {
            return this.formatDate(value as string);
          },
        },
        {
          field: 'updateDate',
          headerName: this.intl.t(
            'treatments.table.advanced.headers.updateDate'
          ),
          sortable: false,
          renderElement: (value: unknown) => {
            return this.formatDate(value as string);
          },
        },
        {
          field: 'data.responsible.fullName',
          headerName: this.intl.t(
            'treatments.table.advanced.headers.responsible'
          ),
          sortable: false,
        },
      ],
      actionMenu: [
        {
          icon: <template><ViewIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.router.transitionTo(
              'dashboard.treatments.view',
              (element as { id: string }).id
            );
          },
          name: this.intl.t('treatments.table.advanced.actions.view'),
        },
        {
          icon: <template><EditIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.router.transitionTo(
              'dashboard.treatments.edit',
              (element as { id: string }).id
            );
          },
          name: this.intl.t('treatments.table.advanced.actions.edit'),
        },
        {
          icon: <template><ArchiveIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          action: async (element: unknown) => {
            const treatment = element as TreatmentWithId;
            if (treatment.status === 'archived') {
              await this.handleUnarchive(treatment);
            } else {
              this.handleArchive(treatment);
            }
          },
          name: this.intl.t('treatments.table.advanced.actions.archive'),
        },
      ],
    };
  }

  @action
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  @action
  async handleTypeUpdate(treatment: Treatment, newType: string): Promise<void> {
    try {
      await this.treatment.updateType(treatment.id || '', newType);
      this.flashMessages.success(
        this.intl.t('treatments.table.advanced.messages.typeUpdateSuccess')
      );
    } catch {
      this.flashMessages.danger(
        this.intl.t('treatments.table.advanced.messages.typeUpdateError')
      );
    }
  }

  @action
  handleArchive(treatment: TreatmentWithId): void {
    this.selectedTreatmentForArchive = treatment;
  }

  @action
  async handleUnarchive(treatment: TreatmentWithId): Promise<void> {
    this.selectedTreatmentForArchive = treatment;
    await this.onConfirmArchiveToggle();
  }

  @action
  onCloseModal(): void {
    this.selectedTreatmentForArchive = null;
  }

  @action
  async onConfirmArchiveToggle(): Promise<void> {
    if (!this.selectedTreatmentForArchive) return;

    try {
      if (this.selectedTreatmentForArchive.status === 'archived') {
        await this.treatment.unarchive(this.selectedTreatmentForArchive.id);
        this.flashMessages.success(
          this.intl.t('treatments.table.advanced.messages.unarchiveSuccess')
        );
      } else {
        await this.treatment.archive(this.selectedTreatmentForArchive.id);
        this.flashMessages.success(
          this.intl.t('treatments.table.advanced.messages.archiveSuccess')
        );
      }
    } catch {
      const errorKey =
        this.selectedTreatmentForArchive.status === 'archived'
          ? 'unarchiveError'
          : 'archiveError';
      this.flashMessages.danger(
        this.intl.t(`treatments.table.advanced.messages.${errorKey}`)
      );
    } finally {
      this.onCloseModal();
    }
  }

  @action
  handleToggleArchived(): void {
    this.includeArchived = !this.includeArchived;
  }

  @action
  handleTypeFilterChange(selection: unknown): void {
    this.treatmentTypeFilter = (selection as string | null) ?? null;
  }

  @action
  clearTypeFilter(): void {
    this.treatmentTypeFilter = null;
  }

  @action
  onAddTreatment(): void {
    this.router.transitionTo('dashboard.treatments.create');
  }

  <template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-semibold">{{t
            "treatments.pages.list.title"
          }}</h1>
        <TpkButton
          @label={{t "treatments.table.actions.addTreatment"}}
          @onClick={{this.onAddTreatment}}
        />
      </div>

      <div class="flex items-center gap-x-4 flex-wrap">
        <div class="tpk-select-container">
          <TpkSelect
            @options={{this.hardcodedTreatmentTypes}}
            @selected={{this.treatmentTypeFilter}}
            @label=""
            @placeholder={{t "treatments.table.advanced.filters.allTypes"}}
            @allowClear={{true}}
            @onChange={{this.handleTypeFilterChange}}
            as |PS|
          >
            <PS.Option as |O|>{{O.option}}</PS.Option>
          </TpkSelect>
        </div>

        <TpkTogglePrefabComponent
          @label={{t "treatments.table.advanced.filters.includeArchived"}}
          @checked={{this.includeArchived}}
          @onChange={{this.handleToggleArchived}}
        />
      </div>

      <TableGenericPrefab
        @tableParams={{this.tableParams}}
        @columnsComponent={{hash
          statusChip=(component StatusChip)
          sensitiveIndicator=(component SensitiveDataIndicator)
          typeEditor=(component
            TreatmentTypeEditor onUpdate=this.handleTypeUpdate
          )
        }}
      />

      <TpkConfirmModalPrefab
        @onClose={{this.onCloseModal}}
        @onConfirm={{this.onConfirmArchiveToggle}}
        @icon=""
        @cancelText={{t "global.cancel"}}
        @confirmText={{t "global.confirm"}}
        @confirmQuestion={{this.confirmQuestion}}
        @isOpen={{this.isModalOpen}}
      />
    </div>
  </template>
}

export default TreatmentsTable;
