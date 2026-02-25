import type { TOC } from '@ember/component/template-only';
import { t } from 'ember-intl';

interface ViewLayoutSignature {
  Args: { title: string };
  Blocks: { default: [] };
}

const ViewLayout: TOC<ViewLayoutSignature> = <template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <span class="text-primary font-bold text-sm tracking-widest uppercase">
        {{t @title}}
      </span>
      <div class="flex-1 border-t border-base-300"></div>
    </div>
    {{yield}}
  </div>
</template>;

export default ViewLayout;
