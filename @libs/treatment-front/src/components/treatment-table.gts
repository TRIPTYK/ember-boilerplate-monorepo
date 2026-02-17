import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import TpkConfirmModalPrefab from '@triptyk/ember-ui/components/prefabs/tpk-confirm-modal-prefab';
import { t, type IntlService } from 'ember-intl';
import EditIcon from '#src/assets/icons/edit.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import type { TOC } from '@ember/component/template-only';
import type TreatmentService from '#src/services/treatment.ts';
import type { UpdatedTreatment } from './forms/treatment-validation';
import { tracked } from '@glimmer/tracking';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

class treatmentsTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare treatment: TreatmentService;
  @service declare flashMessages: FlashMessagesService;

  @tracked selectedTreatmentForDelete: UpdatedTreatment | null = null;

  get isModalOpen(): boolean {
    return this.selectedTreatmentForDelete !== null;
  }

  get confirmQuestion(): string {
    return this.intl.t('treatments.table.confirmModal.question');
  }

  get tableParams(): TableParams {
    return {
      entity: 'treatments',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.treatments.edit',
          (element as { id: string }).id
        );
      },
      defaultSortColumn: 'title',
      columns: [
        {
          field: 'title',
          headerName: this.intl.t('treatments.table.headers.title'),
          sortable: true,
        },
        {
          field: 'description',
          headerName: this.intl.t('treatments.table.headers.description'),
          sortable: true,
        },
      ],
      actionMenu: [
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
          name: this.intl.t('treatments.table.actions.edit'),
        },
        {
          icon: <template><DeleteIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.openModalOnDelete(element as UpdatedTreatment);
          },
          name: this.intl.t('treatments.table.actions.delete'),
        },
      ],
    };
  }

  onAddTreatment = () => {
    this.router.transitionTo('dashboard.treatments.create');
  };

  openModalOnDelete = (element: UpdatedTreatment) => {
    this.selectedTreatmentForDelete = element;
  };

  onCloseModal = () => {
    this.selectedTreatmentForDelete = null;
  };

  onConfirmDelete = async () => {
    if (this.selectedTreatmentForDelete) {
      try {
        await this.treatment.delete(this.selectedTreatmentForDelete);
        this.flashMessages.success(
          this.intl.t('treatments.forms.treatment.messages.deleteSuccess')
        );
      } catch {
        this.flashMessages.danger(
          this.intl.t('treatments.forms.treatment.messages.deleteError')
        );
      }
      this.onCloseModal();
    }
  };

  <template>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{t
          "treatments.pages.list.title"
        }}</h1>
      <TpkButton
        @label={{t "treatments.table.actions.addTreatment"}}
        @onClick={{this.onAddTreatment}}
      />
    </div>
    <TableGenericPrefab @tableParams={{this.tableParams}} />
    <TpkConfirmModalPrefab
      @onClose={{this.onCloseModal}}
      @onConfirm={{this.onConfirmDelete}}
      @icon=""
      @cancelText={{t "global.cancel"}}
      @confirmText={{t "global.confirm"}}
      @confirmQuestion={{this.confirmQuestion}}
      @isOpen={{this.isModalOpen}}
    />
  </template>
}

export default treatmentsTable;
