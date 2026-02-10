import Service, { service } from '@ember/service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';


interface HandleSaveOptions<T> {
  saveAction: () => Promise<T>;
  successMessage?: string;
  transitionOnSuccess?: string;
  transitionOnError?: string;
  idForTransitionOnSuccess?: string;
}

interface JSONAPIError {
  source: { pointer: string },
  detail: string,
}


export default class HandleSaveService extends Service {
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare router: RouterService;

  public async handleSave<T>({
    saveAction,
    successMessage,
    transitionOnError,
    transitionOnSuccess,
    idForTransitionOnSuccess,
  }: HandleSaveOptions<T>) {
    try {
      await saveAction();
      if (successMessage) {
        this.flashMessages.success(
          successMessage
        );
      }
      if (transitionOnSuccess)
      await this.router.transitionTo(
        transitionOnSuccess!,
        idForTransitionOnSuccess ?? undefined
      );
     } catch(error) {
      if (error instanceof AggregateError) {
        for (const singleError of error.errors as JSONAPIError[]) {
          changeset.addError({
            message: singleError.detail ,
            key: singleError.source.pointer.replace('//data/attributes/', ''),
            value: undefined,
            originalValue: undefined
          });
        }
      }
      if (transitionOnError) {
        await this.router.transitionTo(transitionOnError);
      }
     }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'handle-save': HandleSaveService;
  }
}
