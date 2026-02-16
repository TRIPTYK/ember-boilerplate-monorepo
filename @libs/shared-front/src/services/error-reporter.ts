import Service from '@ember/service';

/**
 * Error reporting service that can be used to report errors to an external service like Sentry.
 */
export default class ErrorReporterService extends Service {
  report(error: unknown) {
    // Sentry.captureException(error);
    console.error('An error occurred:', error);
  }
}
