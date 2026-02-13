import type { TOC } from '@ember/component/template-only';
import type TodosIndexRoute from './index.gts';
import TodosTable from '#src/components/todo-table.gts';

export default <template><TodosTable /></template> as TOC<{
  model: Awaited<ReturnType<TodosIndexRoute['model']>>;
  controller: undefined;
}>
