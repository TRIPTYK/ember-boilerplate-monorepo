'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: '@apps/front',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    ENV['ember-simple-auth-token'] = {
      refreshAccessTokens: true,
      tokenExpirationInvalidateSession: true,
      serverTokenEndpoint: 'api/v1/auth/login',
      tokenPropertyName: 'data.accessToken',
      refreshTokenPropertyName: 'data.refreshToken',
      headers: {},
    };
  }

  if (environment === 'e2e') {
    ENV['ember-simple-auth-token'] = {
      serverTokenEndpoint: 'api/v1/auth/login',
      tokenPropertyName: 'data.accessToken',
      refreshTokenPropertyName: 'data.refreshToken',
      headers: {},
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['ember-simple-auth-token'] = {
      serverTokenEndpoint: 'api/v1/auth/login',
      tokenPropertyName: 'data.accessToken',
      refreshTokenPropertyName: 'data.refreshToken',
      headers: {},
    };
  }

  return ENV;
};
