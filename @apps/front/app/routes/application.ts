import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import { setupWorker } from 'msw/browser';
import { initialize as initializeUserLib } from '@libs/users-front';
import { initialize as initializeTodoLib } from '@libs/todos-front';
import { getOwner } from '@ember/-internals/owner';
import type SessionService from '@apps/front/services/session';
import allUsersHandlers from '@libs/users-front/http-mocks/all';
import allTodosHandlers from '@libs/todos-front/http-mocks/all';
import allAuthHandlers from '@libs/auth-front/http-mocks/all';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';
import translationsForFrFr from 'virtual:ember-intl/translations/fr-fr';
import setTheme from '../utils/set-theme';

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  @service declare session: SessionService;
  worker?: ReturnType<typeof setupWorker>;

  async beforeModel() {
    setTheme();
    this.intl.setLocale('en-us');
    this.intl.addTranslations('en-us', translationsForEnUs);
    this.intl.addTranslations('fr-fr', translationsForFrFr);

    // Skip MSW when running against real backend (e2e tests)
    if (import.meta.env.VITE_MOCK_API !== 'false') {
      const worker = setupWorker(
        ...allUsersHandlers,
        ...allTodosHandlers,
        ...allAuthHandlers
      );
      this.worker = worker;
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    }

    await initializeUserLib(getOwner(this)!);
    initializeTodoLib(getOwner(this)!);
  }

  willDestroy() {
    this.worker?.stop();
    return super.willDestroy();
  }
}
