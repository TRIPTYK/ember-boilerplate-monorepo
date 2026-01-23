import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';
import { setupWorker } from 'msw/browser';
import { initialize } from '@libs/users';
import { getOwner } from '@ember/-internals/owner';
import { usersHandlers } from '@libs/users/handlers/users';

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  worker?: ReturnType<typeof setupWorker>;

  async beforeModel() {
    this.intl.setLocale('en-us');
    initialize(getOwner(this)!);
    this.intl.addTranslations('en-us', translationsForEnUs);
    const worker = setupWorker(
      ...usersHandlers
    );
    this.worker = worker;
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  destroy() {
    this.worker?.stop();
    return super.destroy();
  }
}
