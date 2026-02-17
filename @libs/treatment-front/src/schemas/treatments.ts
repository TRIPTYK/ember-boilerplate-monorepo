import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const treatmentSchema = withDefaults({
  type: 'treatments',
  fields: [
    { name: 'createdAt', kind: 'attribute' },
    { name: 'updatedAt', kind: 'attribute' },
    { name: 'title', kind: 'attribute' },
    { name: 'description', kind: 'attribute' },
  ],
});

export default treatmentSchema;

export type Treatment = WithLegacy<{
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  [Type]: 'treatments';
}>;
