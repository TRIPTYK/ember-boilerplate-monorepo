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
import type UserService from '#src/services/user.ts';
import type { UpdatedUser } from './forms/user-validation';
import { tracked } from '@glimmer/tracking';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

class UsersTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare user: UserService;
  @service declare flashMessages: FlashMessagesService;

  @tracked selectedUserForDelete: UpdatedUser | null = null;

  get isModalOpen(): boolean {
    return this.selectedUserForDelete !== null;
  }

  get confirmQuestion(): string {
    return this.intl.t('users.table.confirmModal.question', {
      firstName: this.selectedUserForDelete?.firstName,
      lastName: this.selectedUserForDelete?.lastName,
    });
  }

  get tableParams(): TableParams {
    return {
      entity: 'users',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.users.edit',
          (element as { id: string }).id
        );
      },
      defaultSortColumn: 'firstName',
      columns: [
        {
          field: 'firstName',
          headerName: this.intl.t('users.table.headers.firstName'),
          sortable: true,
        },
        {
          field: 'lastName',
          headerName: this.intl.t('users.table.headers.lastName'),
          sortable: true,
        },
        {
          field: 'email',
          headerName: this.intl.t('users.table.headers.email'),
          sortable: false,
        },
      ],
      actionMenu: [
        {
          icon: <template><EditIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.router.transitionTo(
              'dashboard.users.edit',
              (element as { id: string }).id
            );
          },
          name: this.intl.t('users.table.actions.edit'),
        },
        {
          icon: <template><DeleteIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.openModalOnDelete(element as UpdatedUser);
          },
          name: this.intl.t('users.table.actions.delete'),
        },
      ],
    };
  }

  onAddUser = () => {
    this.router.transitionTo('dashboard.users.create');
  };

  openModalOnDelete = (element: UpdatedUser) => {
    this.selectedUserForDelete = element;
  };

  onCloseModal = () => {
    this.selectedUserForDelete = null;
  };

  onConfirmDelete = async () => {
    if (this.selectedUserForDelete) {
      try {
        await this.user.delete(this.selectedUserForDelete);
        this.flashMessages.success(
          this.intl.t('users.forms.user.messages.deleteSuccess')
        );
      } catch {
        this.flashMessages.danger(
          this.intl.t('users.forms.user.messages.deleteError')
        );
      }
      this.onCloseModal();
    }
  };

  <template>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{t "users.pages.list.title"}}</h1>
      <TpkButton
        @label={{t "users.table.actions.addUser"}}
        @onClick={{this.onAddUser}}
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

export default UsersTable;
