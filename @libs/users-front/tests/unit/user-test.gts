import { beforeAll, describe } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import type UserService from '#src/services/user.ts';
import type { Store } from '@warp-drive/core';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import type { ValidatedUser } from '#src/components/forms/user-validation.ts';

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
  http.patch('/users/:id', (ctx) => {
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
  // eslint-disable-next-line no-empty-pattern
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
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'email@example.com',
    } as ValidatedUser;
    await userService.save(data);
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
    const data = {
      id: '123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    };

    await userService.save(data);
  });
});
