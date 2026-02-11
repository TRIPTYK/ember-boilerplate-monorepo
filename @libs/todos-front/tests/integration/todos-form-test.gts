import { describe, expect as hardExpect, vi } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TodoChangeset } from '#src/changesets/todo.ts';
import TodoForm, { pageObject } from '#src/components/forms/todo-form.gts';
import { initializeTestApp, TestApp } from '../app.ts';
import { stubRouter } from '../utils.ts';
import type TodoService from '#src/services/todo.ts';

const expect = hardExpect.soft;

vi.mock('#src/services/todo.ts', async (importActual) => {
  const actual = await importActual<typeof import('#src/services/todo.ts')>();
  return {
    ...actual,
    default: class MockTodoService extends actual.default {
      save = vi.fn();
    },
  };
});

describe('tpk-form', function () {
  // eslint-disable-next-line no-empty-pattern
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest(
    'Should call todo service when form is valid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const todoService = context.owner.lookup('service:todo') as TodoService;
      const router = stubRouter(context.owner);
      const changeset = new TodoChangeset({});

      await render(<template><TodoForm @changeset={{changeset}} /></template>);

      await pageObject.title('Test Todo');
      await pageObject.description('Test Description');
      await pageObject.completed();
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(todoService.save).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).toHaveBeenCalledWith('dashboard.todos');
    }
  );

  renderingTest(
    'Should not call todo service when form is invalid',
    async function ({ context }) {
      await initializeTestApp(context.owner, 'en-us');

      const todoService = context.owner.lookup('service:todo') as TodoService;
      const router = stubRouter(context.owner);

      router.transitionTo = vi.fn().mockResolvedValue(undefined);

      const changeset = new TodoChangeset({});

      await render(<template><TodoForm @changeset={{changeset}} /></template>);

      await pageObject.title('');
      await pageObject.description('');
      await pageObject.completed();
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(todoService.save).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).not.toHaveBeenCalled();
    }
  );
});
