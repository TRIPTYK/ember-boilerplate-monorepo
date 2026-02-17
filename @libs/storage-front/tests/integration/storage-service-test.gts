import { describe, expect } from 'vitest';
import { test } from 'ember-vitest';
import { TestApp, initializeTestApp } from '../app';
import type StorageService from '#src/services/storage.ts';

describe('Integration | Service | Storage', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  test('initializes and sets isReady to true', async ({ context }) => {
    initializeTestApp(context.owner);
    const storage = context.owner.lookup('service:storage') as StorageService;

    expect(storage.isReady).toBe(false);
    await storage.initialize();
    expect(storage.isReady).toBe(true);
    expect(storage.error).toBeNull();
  });

  test('provides access to treatment repository after initialization', async ({ context }) => {
    initializeTestApp(context.owner);
    const storage = context.owner.lookup('service:storage') as StorageService;
    await storage.initialize();
    await storage.reset();

    const repo = storage.treatmentRepository;
    expect(repo).toBeDefined();

    const treatments = await repo.findAll();
    expect(treatments).toEqual([]);
  });

  test('throws when accessing repository before initialization', ({ context }) => {
    initializeTestApp(context.owner);
    const storage = context.owner.lookup('service:storage') as StorageService;

    expect(() => storage.treatmentRepository).toThrow('Storage is not initialized');
  });
});
