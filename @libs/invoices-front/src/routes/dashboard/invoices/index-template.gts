import type { TOC } from '@ember/component/template-only';
import type InvoicesIndexRoute from './index.gts';
import InvoiceList from '#src/components/invoice-list.gts';

export default <template>
  <InvoiceList @model={{@model}} />
</template> as TOC<{
  model: Awaited<ReturnType<InvoicesIndexRoute['model']>>;
  controller: undefined;
}>;
