import { describe, expect as hardExpect, vi } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { UserChangeset } from '#src/changesets/todo.ts';
import UsersForm, { pageObject } from '#src/components/forms/todo-form.gts';
import { initializeTestApp, TestApp } from '../app.ts';
import type UserService from '#src/services/todo.ts';
import { stubRouter } from '../utils.ts';

const expect = hardExpect.soft;

vi.mock('#src/services/user.ts', async (importActual) => {
  const actual = await importActual<typeof import('#src/services/todo.ts')>();
  return {
    ...actual,
    default: class MockUserService extends actual.default {
      save = vi.fn();
    },
  };
});

describe('tpk-form', function () {
  // eslint-disable-next-line no-empty-pattern
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest(
    'Should call user service when form is valid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const userService = context.owner.lookup('service:user') as UserService;
      const router = stubRouter(context.owner);
      const changeset = new UserChangeset({});

      await render(<template><UsersForm @changeset={{changeset}} /></template>);

      await pageObject.firstName('John');
      await pageObject.lastName('Doe');
      await pageObject.email('john.doe@example.com');
      await pageObject.password('password123');
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.save).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).toHaveBeenCalledWith('dashboard.users');
    }
  );

  renderingTest(
    'Should not call user service when form is invalid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const userService = context.owner.lookup('service:user') as UserService;
      const router = stubRouter(context.owner);

      router.transitionTo = vi.fn().mockResolvedValue(undefined);

      const changeset = new UserChangeset({});

      await render(<template><UsersForm @changeset={{changeset}} /></template>);

      await pageObject.firstName('');
      await pageObject.lastName('');
      await pageObject.email('john.doe@example.com');
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.save).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).not.toHaveBeenCalled();
    }
  );
});
