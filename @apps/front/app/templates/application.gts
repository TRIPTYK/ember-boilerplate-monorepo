import { pageTitle } from 'ember-page-title';
import FlashMessage from 'ember-cli-flash/components/flash-message';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';

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
    <div class="alerts">
      {{#each this.flashMessages.arrangedQueue as |flash|}}
        <FlashMessage @flash={{flash}} />
      {{/each}}
    </div>

    {{outlet}}
  </template>
}

export default ApplicationTemplate;
