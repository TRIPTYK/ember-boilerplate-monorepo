import Service, { service } from '@ember/service';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';
import type { ImmerChangeset } from 'ember-immer-changeset';
import type ErrorReporterService from './error-reporter';

interface HandleSaveOptions<T> {
  saveAction: () => Promise<T>;
  changeset?: ImmerChangeset;
  successMessage?: string;
  transitionOnSuccess?: string;
  transitionOnError?: string;
  idForTransitionOnSuccess?: string | string[];
}

interface JSONAPIError {
  source: { pointer: string };
  detail: string;
}

export default class HandleSaveService extends Service {
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare router: RouterService;
  @service declare errorReporter: ErrorReporterService;

  public async handleSave<T>({
    saveAction,
    successMessage,
    transitionOnError,
    transitionOnSuccess,
    idForTransitionOnSuccess,
    changeset,
  }: HandleSaveOptions<T>) {
    try {
      await saveAction();
      if (successMessage) {
        this.flashMessages.success(
          this.intl.exists(successMessage)
            ? this.intl.t(successMessage)
            : successMessage
        );
      }
      if (transitionOnSuccess)
        if (idForTransitionOnSuccess) {
          await this.router.transitionTo(
            transitionOnSuccess,
            ...(Array.isArray(idForTransitionOnSuccess)
              ? idForTransitionOnSuccess
              : [idForTransitionOnSuccess])
          );
        } else {
          await this.router.transitionTo(transitionOnSuccess);
        }
    } catch (error) {
      let handled = false;

      if (error instanceof AggregateError) {
        this.handleAggregateError(error, changeset);
        handled = true;
      }

      // probably a fatal error ?
      if (!handled) {
        this.errorReporter.report(error);
      }

      if (transitionOnError) {
        await this.router.transitionTo(transitionOnError);
      }
    }
  }

  private handleAggregateError(
    error: AggregateError,
    changeset?: ImmerChangeset
  ) {
    if (changeset) {
      this.addErrorsToChangeset(error, changeset);
    } else {
      this.reportAggregateError(error);
    }
  }

  private addErrorsToChangeset(
    error: AggregateError,
    changeset: ImmerChangeset
  ) {
    for (const singleError of error.errors as JSONAPIError[]) {
      changeset.addError({
        message: singleError.detail,
        key: singleError.source.pointer.replace('//data/attributes/', ''),
        value: undefined,
        originalValue: undefined,
      });
    }
  }

  private reportAggregateError(error: AggregateError) {
    this.errorReporter.report(error);
    this.flashMessages.danger(
      this.intl.t('shared.handle-save.generic-error-message')
    );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'handle-save': HandleSaveService;
  }
}
