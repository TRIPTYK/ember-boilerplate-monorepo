import Component from '@glimmer/component';
import { t } from 'ember-intl';
import type { TreatmentStatus } from '#src/components/forms/treatment-validation.ts';

interface StatusChipArgs {
  Args: {
    row: {
      status: TreatmentStatus;
      isOverDueDate?: boolean;
    };
  };
}

export default class StatusChip extends Component<StatusChipArgs> {
  get statusColor(): string {
    if (this.args.row.isOverDueDate) {
      return 'error';
    }

    switch (this.args.row.status) {
      case 'draft':
        return 'warning';
      case 'validated':
        return 'success';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  }

  get statusVariant(): 'filled' | 'outlined' {
    return this.args.row.status === 'archived' ? 'outlined' : 'filled';
  }

  get statusKey(): string {
    if (this.args.row.isOverDueDate) {
      return 'treatments.table.advanced.status.overdue';
    }
    return `treatments.table.advanced.status.${this.args.row.status}`;
  }

  get badgeClass(): string {
    const baseClass = 'badge badge-sm';
    const colorMap: Record<string, string> = {
      error: 'badge-error',
      warning: 'badge-warning',
      success: 'badge-success',
      default: 'badge-ghost',
    };

    const variantClass =
      this.statusVariant === 'outlined' ? 'badge-outline' : '';

    return `${baseClass} ${colorMap[this.statusColor]} ${variantClass}`.trim();
  }

  <template>
    <span class={{this.badgeClass}}>
      {{t this.statusKey}}
    </span>
  </template>
}
