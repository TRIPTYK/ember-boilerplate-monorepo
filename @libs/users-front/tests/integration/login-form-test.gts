/* eslint-disable @typescript-eslint/unbound-method */
import { describe, expect as hardExpect, vi } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import LoginForm, { pageObject } from '#src/components/forms/login-form.gts';
import { initializeTestApp, TestApp } from '../app.ts';
import type SessionService from 'ember-simple-auth/services/session';

const expect = hardExpect.soft;

vi.mock('ember-simple-auth/services/session', async (importActual) => {
  const actual =
    await importActual<typeof import('ember-simple-auth/services/session')>();
  return {
    ...actual,
    default: class MockSessionService extends actual.default {
      authenticate = vi.fn();
    },
  };
});

describe('login-form', function () {
  // eslint-disable-next-line no-empty-pattern
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest(
    'Should call session.authenticate when form is valid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const sessionService = context.owner.lookup(
        'service:session',
      ) as SessionService;

      await render(<template><LoginForm /></template>);

      await pageObject.email('test@example.com');
      await pageObject.password('strongpassword123');
      await pageObject.submit();

      expect(sessionService.authenticate).toHaveBeenCalledWith(
        'authenticator:jwt',
        {
          email: 'test@example.com',
          password: 'strongpassword123',
        },
      );
    },
  );

  renderingTest(
    'Should not call session.authenticate when email is invalid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const sessionService = context.owner.lookup(
        'service:session',
      ) as SessionService;

      await render(<template><LoginForm /></template>);

      await pageObject.email('invalidemail');
      await pageObject.password('strongpassword123');
      await pageObject.submit();

      expect(sessionService.authenticate).not.toHaveBeenCalled();
    },
  );

  renderingTest(
    'Should not call session.authenticate when password is too short',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const sessionService = context.owner.lookup(
        'service:session',
      ) as SessionService;

      await render(<template><LoginForm /></template>);

      await pageObject.email('test@example.com');
      await pageObject.password('short');
      await pageObject.submit();

      expect(sessionService.authenticate).not.toHaveBeenCalled();
    },
  );

  renderingTest(
    'Should not call session.authenticate when both fields are invalid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const sessionService = context.owner.lookup(
        'service:session',
      ) as SessionService;

      await render(<template><LoginForm /></template>);

      await pageObject.email('');
      await pageObject.password('');
      await pageObject.submit();

      expect(sessionService.authenticate).not.toHaveBeenCalled();
    },
  );
});
