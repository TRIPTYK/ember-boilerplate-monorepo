import Component from '@glimmer/component';
import { t } from 'ember-intl';
import type { Treatment, TreatmentStatus } from '#src/schemas/treatments.ts';

interface HeaderCardSignature {
  Args: {
    treatment: Treatment & { id: string };
  };
}

export default class HeaderCard extends Component<HeaderCardSignature> {
  get formattedCreationDate(): string {
    const d = this.args.treatment.creationDate;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('fr-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  get formattedUpdateDate(): string {
    const d = this.args.treatment.updateDate;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('fr-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  get statusBadgeClass(): string {
    const map: Record<TreatmentStatus, string> = {
      draft: 'badge badge-sm badge-warning',
      validated: 'badge badge-sm badge-success',
      archived: 'badge badge-sm badge-ghost',
    };
    return map[this.args.treatment.status] ?? 'badge badge-sm badge-ghost';
  }

  get statusTranslationKey(): string {
    return `treatments.table.advanced.status.${this.args.treatment.status}`;
  }

  <template>
    <div class="card bg-base-100 shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-primary">
            {{t "treatments.details.title"}}
          </span>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-2xl font-bold text-base-content">
              {{@treatment.data.title}}
            </span>
            <span class={{this.statusBadgeClass}}>
              {{t this.statusTranslationKey}}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-primary">
            {{t "treatments.details.creationDate"}}
          </span>
          <span class="text-2xl font-bold text-base-content">
            {{this.formattedCreationDate}}
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-primary">
            {{t "treatments.details.updateDate"}}
          </span>
          <span class="text-2xl font-bold text-base-content">
            {{this.formattedUpdateDate}}
          </span>
        </div>
      </div>
    </div>
  </template>
}
