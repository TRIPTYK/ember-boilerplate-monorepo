import RouteTemplate from "ember-route-template";
import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import CounterComponent from "front-app/components/counter.gts";

interface ApplicationSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

const template: TOC<ApplicationSignature> = <template>
  {{pageTitle "Application"}}
  <CounterComponent />
  {{outlet}}
</template>;

export default RouteTemplate(template)
