import { describe, expect } from 'vitest';
import { test } from 'ember-vitest';
import { TestApp, initializeTestApp } from '../app';
import type StorageService from '#src/services/storage.ts';
import type TreatmentService from '#src/services/treatment.ts';

describe('Integration | Service | Treatment', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  async function setupServices(owner: object) {
    const storage = (owner as { lookup: (key: string) => unknown }).lookup('service:storage') as StorageService;
    await storage.initialize();
    await storage.reset();
    return (owner as { lookup: (key: string) => unknown }).lookup('service:treatment') as TreatmentService;
  }

  test('creates a treatment via save()', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    const result = await treatmentService.save({ title: 'New Treatment' });
    expect(result).toBeDefined();
    expect(result?.title).toBe('New Treatment');
    expect(result?.status).toBe('draft');
  });

  test('updates a treatment via save() when id is present', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    const created = await treatmentService.create({ title: 'Original' });
    const updated = await treatmentService.save({ id: created.id, title: 'Updated' });

    expect(updated?.title).toBe('Updated');
  });

  test('deletes a treatment', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    const created = await treatmentService.create({ title: 'To Delete' });
    const deleted = await treatmentService.delete(created.id);
    expect(deleted).toBe(true);

    const found = await treatmentService.findById(created.id);
    expect(found).toBeUndefined();
  });

  test('finds all treatments', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    await treatmentService.create({ title: 'First' });
    await treatmentService.create({ title: 'Second' });

    const all = await treatmentService.findAll();
    expect(all).toHaveLength(2);
  });

  test('finds treatments by status', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    await treatmentService.create({ title: 'Draft', status: 'draft' });
    await treatmentService.create({ title: 'Validated', status: 'validated' });

    const drafts = await treatmentService.findByStatus('draft');
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.title).toBe('Draft');
  });

  test('searches treatments', async ({ context }) => {
    initializeTestApp(context.owner);
    const treatmentService = await setupServices(context.owner);

    await treatmentService.create({ title: 'Data Processing', description: 'Employee data' });
    await treatmentService.create({ title: 'Marketing Campaign' });

    const results = await treatmentService.search('data');
    expect(results).toHaveLength(1);
  });
});
