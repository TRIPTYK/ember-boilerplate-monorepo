import { beforeAll, describe } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import type UserService from '#src/services/user.ts';
import type { Store } from '@warp-drive/core';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('/users', () => {
    return HttpResponse.json({
      data: {
        type: 'users',
        id: 'new-user-id',
        attributes: {},
      },
    });
  }),
  http.put('/users/:id', (ctx) => {
    return HttpResponse.json({
      data: {
        type: 'users',
        id: ctx.params['id'],
        attributes: {},
      },
    });
  }),
];

describe('Service | User | Unit', () => {
  test.scoped({ app: ({}, use) => use(TestApp) });

  beforeAll(async () => {
    const worker = setupWorker(...handlers);
    await worker.start();
    return () => {
      worker.stop();
    };
  });

  test('if user does not already exists in store, it creates it with a POST request', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const userService = context.owner.lookup('service:user') as UserService;

    await userService.save({
      firstName: 'John',
      lastName: 'Doe',
      email: 'email@example.com',
    });
  });

  test('if user already exists in store, it updates it with a PATCH request', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const userService = context.owner.lookup('service:user') as UserService;
    const store = context.owner.lookup('service:store') as Store;

    store.createRecord('users', {
      id: '123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    });

    await userService.save({
      id: '123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    });
  });
});
