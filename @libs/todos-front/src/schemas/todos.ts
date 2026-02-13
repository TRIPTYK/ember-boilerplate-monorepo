import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const TodoSchema = withDefaults({
  type: 'todos',
  fields: [
    { name: 'createdAt', kind: 'attribute' },
    { name: 'updatedAt', kind: 'attribute' },
    { name: 'title', kind: 'attribute' },
    { name: 'description', kind: 'attribute' },
    { name: 'completed', kind: 'attribute' },
  ],
});

export default TodoSchema;

export type Todo = WithLegacy<{
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  completed: boolean;
  [Type]: 'todos';
}>;
