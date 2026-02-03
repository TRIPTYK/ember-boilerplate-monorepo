import { pageTitle } from 'ember-page-title';
import FlashMessage from 'ember-cli-flash/components/flash-message';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
// eslint-disable-next-line
import component from '@ember/component/template-only';


interface ApplicationSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

class ApplicationTemplate extends Component<ApplicationSignature> {
  @service declare flashMessages: FlashMessageService;

  <template>
    {{pageTitle "Application"}}

    {{#each this.flashMessages.queue as |flashC|}}
      <FlashMessage @flash={{flashC}} as |component flash|>
        {{#if flash.componentName}}
          {{!-- @glint-expect-error --}}
          {{component flash.componentName content=flash.content}}
        {{else}}
          {{!-- @glint-expect-error --}}
          <h6>{{component.flashType}}</h6>
          <p>{{flash.message}}</p>
        {{/if}}
      </FlashMessage>
    {{/each}}

    {{outlet}}
  </template>;
}

export default ApplicationTemplate;
