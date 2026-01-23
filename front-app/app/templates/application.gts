import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

interface ApplicationSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

const template: TOC<ApplicationSignature> = <template>
  {{pageTitle "Application"}}

  {{outlet}}
</template>;

export default template;
