import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';
import { setupWorker } from 'msw/browser';
import { initialize as initializeUserLib } from '@libs/users';
import { getOwner } from '@ember/-internals/owner';
import type SessionService from 'front-app/services/session';
import allHandlers from '@libs/users/http-mocks/all';

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  @service declare session: SessionService;
  worker?: ReturnType<typeof setupWorker>;

  async beforeModel() {
    this.intl.setLocale('en-us');
    this.intl.addTranslations('en-us', translationsForEnUs);
    const worker = setupWorker(
      ...allHandlers
    );
    this.worker = worker;
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    await initializeUserLib(getOwner(this)!);
  }

  destroy() {
    this.worker?.stop();
    return super.destroy();
  }
}
