import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import type { Treatment } from '#src/schemas/treatments.ts';

interface TreatmentActionsArgs {
  Args: {
    row: Treatment;
    onView: (treatment: Treatment) => void;
    onEdit: (treatment: Treatment) => void;
    onArchive: (treatment: Treatment) => Promise<void>;
    onUnarchive: (treatment: Treatment) => Promise<void>;
  };
}

export default class TreatmentActions extends Component<TreatmentActionsArgs> {
  get isArchived(): boolean {
    return this.args.row.status === 'archived';
  }

  @action
  handleView(event: MouseEvent): void {
    event.stopPropagation();
    this.args.onView(this.args.row);
  }

  @action
  handleEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.args.onEdit(this.args.row);
  }

  @action
  async handleArchiveToggle(event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (this.isArchived) {
      await this.args.onUnarchive(this.args.row);
    } else {
      await this.args.onArchive(this.args.row);
    }
  }

  <template>
    <div class="flex gap-2">
      <div
        class="tooltip"
        data-tip={{t "treatments.table.advanced.actions.view"}}
      >
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          {{on "click" this.handleView}}
          aria-label={{t "treatments.table.advanced.actions.view"}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        class="tooltip"
        data-tip={{t "treatments.table.advanced.actions.edit"}}
      >
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          {{on "click" this.handleEdit}}
          aria-label={{t "treatments.table.advanced.actions.edit"}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
      </div>

      <div
        class="tooltip"
        data-tip={{if
          this.isArchived
          (t "treatments.table.advanced.actions.unarchive")
          (t "treatments.table.advanced.actions.archive")
        }}
      >
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          {{on "click" this.handleArchiveToggle}}
          aria-label={{if
            this.isArchived
            (t "treatments.table.advanced.actions.unarchive")
            (t "treatments.table.advanced.actions.archive")
          }}
        >
          {{#if this.isArchived}}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fill-rule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          {{else}}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fill-rule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          {{/if}}
        </button>
      </div>
    </div>
  </template>
}
