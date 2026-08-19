import { describe, expect } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import { mockApi } from '../mock-api.ts';
import type UserService from '#src/services/user.ts';
import type { Store } from '@warp-drive/core';
import type { ValidatedUser } from '#src/components/forms/user-validation.ts';
import type { User } from '#src/schemas/users.ts';

const usersApi = mockApi({
  'POST /users': () => ({
    data: {
      type: 'users',
      id: 'new-user-id',
      attributes: {},
    },
  }),
  'PATCH /users/:id': ({ params }) => ({
    data: {
      type: 'users',
      id: params['id'],
      attributes: {},
    },
  }),
});

describe('Service | User | Unit', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  test('if user does not already exists in store, it creates it with a POST request', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us', [usersApi]);
    const userService = context.owner.lookup('service:user') as UserService;
    const store = context.owner.lookup('service:store') as Store;
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'email@example.com',
    } as ValidatedUser;

    await expect(userService.save(data)).resolves.not.toThrow();

    const createdUser = store.peekRecord<User>({
      type: 'users',
      id: 'new-user-id',
    });
    expect(createdUser).not.toBeNull();
  });

  test('if user already exists in store, it updates it with a PATCH request', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us', [usersApi]);
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

    await expect(userService.save(data)).resolves.not.toThrow();

    const updatedUser = store.peekRecord<User>({ type: 'users', id: '123' });
    expect(updatedUser).not.toBeNull();
  });
});
