import { beforeAll, describe } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import type { Store } from '@warp-drive/core';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import type TodoService from '#src/services/todo.ts';
import type { ValidatedTodo } from '#src/components/forms/todo-validation.ts';

const handlers = [
  http.post('/todos', () => {
    return HttpResponse.json({
      data: {
        type: 'todos',
        id: 'new-todo-id',
        attributes: {},
      },
    });
  }),
  http.patch('/todos/:id', (ctx) => {
    return HttpResponse.json({
      data: {
        type: 'todos',
        id: ctx.params['id'],
        attributes: {},
      },
    });
  }),
];

describe('Service | Todo | Unit', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  beforeAll(async () => {
    const worker = setupWorker(...handlers);
    await worker.start();
    return () => {
      worker.stop();
    };
  });

  test('if todo does not already exists in store, it creates it with a POST request', async ({
    context,
  }) => {
    initializeTestApp(context.owner, 'en-us');
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
    initializeTestApp(context.owner, 'en-us');
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
