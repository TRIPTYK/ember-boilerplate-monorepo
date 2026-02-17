import type { TOC } from '@ember/component/template-only';
import type treatmentsIndexRoute from './index.gts';
import treatmentsTable from '#src/components/treatment-table.gts';

export default <template><treatmentsTable /></template> as TOC<{
  model: Awaited<ReturnType<treatmentsIndexRoute['model']>>;
  controller: undefined;
}>
