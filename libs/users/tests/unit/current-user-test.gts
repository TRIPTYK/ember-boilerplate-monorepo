import { describe, expect, vi } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import type CurrentUserService from '#src/services/current-user.ts';

describe('Service | CurrentUser | Unit', () => {
  test.scoped({ app: ({}, use) => use(TestApp) });

  test('currentUser getter throws error when no user is set', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const currentUserService = context.owner.lookup(
      'service:current-user'
    ) as CurrentUserService;
    expect(() => currentUserService.currentUser).toThrow('No current user set');
  });

  test('currentUser getter returns user when user is set', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const currentUserService = context.owner.lookup(
      'service:current-user'
    ) as CurrentUserService;

    // Set a user manually
    currentUserService.user = {
      id: '123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    } as never;

    expect(currentUserService.currentUser).toEqual({
      id: '123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    });
  });

  test('load method clears user when session is not authenticated', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const currentUserService = context.owner.lookup(
      'service:current-user'
    ) as CurrentUserService;

    // Set a user first
    currentUserService.user ={
      id: '123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    } as never;

    // Mock session as not authenticated
    vi.spyOn(currentUserService.session, 'isAuthenticated', 'get').mockReturnValue(false);

    await currentUserService.load();

    expect(currentUserService.user).toBeUndefined();
  });

  test('load method fetches and sets user when session is authenticated', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const currentUserService = context.owner.lookup(
      'service:current-user'
    ) as CurrentUserService;

    const mockUser = {
      id: '123',
      type: 'users' as const,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    // Mock session as authenticated
    vi.spyOn(currentUserService.session, 'isAuthenticated', 'get').mockReturnValue(true);

    // Mock store request to return our mock user
    vi.spyOn(currentUserService.store, 'request').mockResolvedValue({
      content: mockUser,
    } as never);

    await currentUserService.load();

    expect(currentUserService.user).toBeDefined();
    expect(currentUserService.user).toBe(mockUser);
  });

  test('currentUser getter works after successful load', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const currentUserService = context.owner.lookup(
      'service:current-user'
    ) as CurrentUserService;

    const mockUser = {
      id: '123',
      type: 'users' as const,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    // Mock session as authenticated
    vi.spyOn(currentUserService.session, 'isAuthenticated', 'get').mockReturnValue(true);

    // Mock store request to return our mock user
    vi.spyOn(currentUserService.store, 'request').mockResolvedValue({
      content: mockUser,
    } as never);

    await currentUserService.load();

    const user = currentUserService.currentUser;
    expect(user).toBe(mockUser);
    expect(user.id).toBe('123');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
  });
});
