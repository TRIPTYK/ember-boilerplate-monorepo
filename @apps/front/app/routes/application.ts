import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import { initialize as initializeUserLib } from '@libs/users-front';
import { initialize as initializeTodoLib } from '@libs/todos-front';
import { getOwner } from '@ember/-internals/owner';
import type SessionService from '@apps/front/services/session';
import setTheme from '../utils/set-theme';
import translationsForFrFr from 'virtual:ember-intl/translations/fr-fr';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  @service declare session: SessionService;

  async beforeModel() {
    setTheme();
    this.intl.setLocale('en-us');

    this.intl.addTranslations('fr-fr', translationsForFrFr);
    this.intl.addTranslations('en-us', translationsForEnUs);

    await initializeUserLib(getOwner(this)!);
    initializeTodoLib(getOwner(this)!);
  }
}
