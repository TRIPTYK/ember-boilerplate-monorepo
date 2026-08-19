import { describe } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import { mockApi } from '../mock-api.ts';
import type { Store } from '@warp-drive/core';
import type TodoService from '#src/services/todo.ts';
import type { ValidatedTodo } from '#src/components/forms/todo-validation.ts';

const todosApi = mockApi({
  'POST /todos': () => ({
    data: {
      type: 'todos',
      id: 'new-todo-id',
      attributes: {},
    },
  }),
  'PATCH /todos/:id': ({ params }) => ({
    data: {
      type: 'todos',
      id: params['id'],
      attributes: {},
    },
  }),
});

describe('Service | Todo | Unit', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  test('if todo does not already exists in store, it creates it with a POST request', async ({
    context,
  }) => {
    initializeTestApp(context.owner, 'en-us', [todosApi]);
    const todoService = context.owner.lookup('service:todo') as TodoService;
    const data = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
    } as ValidatedTodo;
    await todoService.save(data);
  });

  test('if todo already exists in store, it updates it with a PATCH request', async ({
    context,
  }) => {
    initializeTestApp(context.owner, 'en-us', [todosApi]);
    const todoService = context.owner.lookup('service:todo') as TodoService;
    const store = context.owner.lookup('service:store') as Store;
    const data = {
      id: '123',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
    } as ValidatedTodo;
    store.createRecord('todos', data);

    await todoService.save(data);
  });
});
