import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const treatmentSchema = withDefaults({
  type: 'treatments',
  fields: [
    { name: 'creationDate', kind: 'attribute' },
    { name: 'updateDate', kind: 'attribute' },
    { name: 'dueDateForUpdate', kind: 'attribute' },
    { name: 'status', kind: 'attribute' },
    { name: 'order', kind: 'attribute' },
    { name: 'isOverDueDate', kind: 'attribute' },
    { name: 'data', kind: 'attribute' },
  ],
});

export default treatmentSchema;

export type Treatment = WithLegacy<{
  creationDate: string;
  updateDate?: string;
  dueDateForUpdate?: string;
  status: string;
  order?: string;
  isOverDueDate?: boolean;
  data: any;
  [Type]: 'treatments';
}>;
