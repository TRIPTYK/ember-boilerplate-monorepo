import type { TOC } from '@ember/component/template-only';
import type treatmentsIndexRoute from './index.gts';
import TreatmentsTable from '#src/components/treatments-table.gts';

export default <template><TreatmentsTable /></template> as TOC<{
  model: Awaited<ReturnType<treatmentsIndexRoute['model']>>;
  controller: undefined;
}>
