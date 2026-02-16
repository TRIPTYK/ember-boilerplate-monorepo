import { describe, expect, vi } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import { stubRouter } from '../utils';
import type HandleSaveService from '#src/services/handle-save.ts';

describe('Service | HandleSave | Unit', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  test('calls saveAction and shows success flash message', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const successSpy = vi.spyOn(service.flashMessages, 'success');
    const saveAction = vi.fn().mockResolvedValue(undefined);

    await service.handleSave({
      saveAction,
      successMessage: 'Saved successfully',
    });

    expect(saveAction).toHaveBeenCalledOnce();
    expect(successSpy).toHaveBeenCalledWith('Saved successfully');
  });

  test('transitions on success', async ({ context }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const router = stubRouter(context.owner);
    const saveAction = vi.fn().mockResolvedValue(undefined);

    await service.handleSave({
      saveAction,
      transitionOnSuccess: 'dashboard.users',
    });

    expect(router.transitionTo).toHaveBeenCalledWith(
      'dashboard.users',
      undefined
    );
  });

  test('transitions on success with id', async ({ context }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const router = stubRouter(context.owner);
    const saveAction = vi.fn().mockResolvedValue(undefined);

    await service.handleSave({
      saveAction,
      transitionOnSuccess: 'dashboard.users',
      idForTransitionOnSuccess: '123',
    });

    expect(router.transitionTo).toHaveBeenCalledWith(
      'dashboard.users',
      '123'
    );
  });

  test('no flash or transition when options not provided', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const router = stubRouter(context.owner);
    const successSpy = vi.spyOn(service.flashMessages, 'success');
    const dangerSpy = vi.spyOn(service.flashMessages, 'danger');
    const saveAction = vi.fn().mockResolvedValue(undefined);

    await service.handleSave({ saveAction });

    expect(saveAction).toHaveBeenCalledOnce();
    expect(successSpy).not.toHaveBeenCalled();
    expect(dangerSpy).not.toHaveBeenCalled();
    expect(router.transitionTo).not.toHaveBeenCalled();
  });

  test('adds JSON-API errors to changeset', async ({ context }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const changeset = { addError: vi.fn() };
    const saveAction = vi.fn().mockRejectedValue(
      new AggregateError([
        {
          source: { pointer: '//data/attributes/first-name' },
          detail: 'is required',
        },
      ])
    );

    await service.handleSave({
      saveAction,
      changeset: changeset as never,
    });

    expect(changeset.addError).toHaveBeenCalledWith({
      key: 'first-name',
      message: 'is required',
      value: undefined,
      originalValue: undefined,
    });
  });

  test('strips //data/attributes/ prefix from pointer', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const changeset = { addError: vi.fn() };
    const saveAction = vi.fn().mockRejectedValue(
      new AggregateError([
        {
          source: { pointer: '//data/attributes/email' },
          detail: 'is invalid',
        },
      ])
    );

    await service.handleSave({
      saveAction,
      changeset: changeset as never,
    });

    expect(changeset.addError).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'email' })
    );
  });

  test('multiple errors are all added to changeset', async ({ context }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const changeset = { addError: vi.fn() };
    const saveAction = vi.fn().mockRejectedValue(
      new AggregateError([
        {
          source: { pointer: '//data/attributes/first-name' },
          detail: 'is required',
        },
        {
          source: { pointer: '//data/attributes/email' },
          detail: 'is invalid',
        },
        {
          source: { pointer: '//data/attributes/age' },
          detail: 'must be a number',
        },
      ])
    );

    await service.handleSave({
      saveAction,
      changeset: changeset as never,
    });

    expect(changeset.addError).toHaveBeenCalledTimes(3);
    expect(changeset.addError).toHaveBeenCalledWith({
      key: 'first-name',
      message: 'is required',
      value: undefined,
      originalValue: undefined,
    });
    expect(changeset.addError).toHaveBeenCalledWith({
      key: 'email',
      message: 'is invalid',
      value: undefined,
      originalValue: undefined,
    });
    expect(changeset.addError).toHaveBeenCalledWith({
      key: 'age',
      message: 'must be a number',
      value: undefined,
      originalValue: undefined,
    });
  });

  test('shows generic danger flash message when no changeset provided', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const dangerSpy = vi.spyOn(service.flashMessages, 'danger');
    const intlSpy = vi.spyOn(service.intl, 't').mockReturnValue(
      'An error occurred' as never
    );
    const saveAction = vi.fn().mockRejectedValue(
      new AggregateError([
        {
          source: { pointer: '//data/attributes/name' },
          detail: 'is required',
        },
      ])
    );

    await service.handleSave({ saveAction });

    expect(intlSpy).toHaveBeenCalledWith(
      'shared.handle-save.generic-error-message'
    );
    expect(dangerSpy).toHaveBeenCalledWith('An error occurred');
  });

  test('transitions on error when transitionOnError is set', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const router = stubRouter(context.owner);
    const saveAction = vi.fn().mockRejectedValue(
      new AggregateError([
        {
          source: { pointer: '//data/attributes/name' },
          detail: 'is required',
        },
      ])
    );

    await service.handleSave({
      saveAction,
      changeset: { addError: vi.fn() } as never,
      transitionOnError: 'dashboard',
    });

    expect(router.transitionTo).toHaveBeenCalledWith('dashboard');
  });

  test('non-AggregateError does not add changeset errors or show flash', async ({
    context,
  }) => {
    await initializeTestApp(context.owner, 'en-us');
    const service = context.owner.lookup(
      'service:handle-save'
    ) as HandleSaveService;

    const router = stubRouter(context.owner);
    const changeset = { addError: vi.fn() };
    const dangerSpy = vi.spyOn(service.flashMessages, 'danger');
    const saveAction = vi.fn().mockRejectedValue(new Error('Network error'));

    await service.handleSave({
      saveAction,
      changeset: changeset as never,
      transitionOnError: 'dashboard',
    });

    expect(changeset.addError).not.toHaveBeenCalled();
    expect(dangerSpy).not.toHaveBeenCalled();
    expect(router.transitionTo).toHaveBeenCalledWith('dashboard');
  });
});
