import { afterEach, describe, expect } from 'vitest';
import { test } from 'ember-vitest';
import { Database } from '#src/core/database.ts';
import { TreatmentEntity } from '#src/entities/treatment.entity.ts';
import { TreatmentRepository } from '#src/repositories/treatment-repository.ts';

describe('Unit | Repository | TreatmentRepository', () => {
  let db: Database;
  let repo: TreatmentRepository;

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  async function setupRepo(dbName: string) {
    db = new Database();
    await db.initialize(dbName);
    await db.createTable(TreatmentEntity);
    repo = new TreatmentRepository(db);
  }

  test('creates a treatment and returns it with generated id and timestamps', async () => {
    await setupRepo('test-repo-create');

    const treatment = await repo.create({
      title: 'GDPR Treatment',
      description: 'Test description',
      status: 'draft',
    });

    expect(treatment.id).toBeTruthy();
    expect(treatment.title).toBe('GDPR Treatment');
    expect(treatment.description).toBe('Test description');
    expect(treatment.status).toBe('draft');
    expect(treatment.createdAt).toBeTruthy();
    expect(treatment.updatedAt).toBeTruthy();
  });

  test('finds a treatment by id', async () => {
    await setupRepo('test-repo-find-by-id');

    const created = await repo.create({
      title: 'Find Me',
      description: null,
      status: 'draft',
    });

    const found = await repo.findById(created.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe('Find Me');
  });

  test('returns undefined for non-existent id', async () => {
    await setupRepo('test-repo-not-found');

    const found = await repo.findById('nonexistent');
    expect(found).toBeUndefined();
  });

  test('finds all treatments', async () => {
    await setupRepo('test-repo-find-all');

    await repo.create({ title: 'First', description: null, status: 'draft' });
    await repo.create({ title: 'Second', description: null, status: 'validated' });

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  test('updates a treatment', async () => {
    await setupRepo('test-repo-update');

    const created = await repo.create({
      title: 'Original',
      description: null,
      status: 'draft',
    });

    const updated = await repo.update(created.id, { title: 'Updated Title' });
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.updatedAt).not.toBe(created.updatedAt);
  });

  test('deletes a treatment', async () => {
    await setupRepo('test-repo-delete');

    const created = await repo.create({
      title: 'To Delete',
      description: null,
      status: 'draft',
    });

    const deleted = await repo.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repo.findById(created.id);
    expect(found).toBeUndefined();
  });

  test('returns false when deleting non-existent treatment', async () => {
    await setupRepo('test-repo-delete-missing');

    const deleted = await repo.delete('nonexistent');
    expect(deleted).toBe(false);
  });

  test('counts treatments', async () => {
    await setupRepo('test-repo-count');

    expect(await repo.count()).toBe(0);

    await repo.create({ title: 'One', description: null, status: 'draft' });
    await repo.create({ title: 'Two', description: null, status: 'draft' });

    expect(await repo.count()).toBe(2);
  });

  test('finds treatments by status', async () => {
    await setupRepo('test-repo-find-by-status');

    await repo.create({ title: 'Draft', description: null, status: 'draft' });
    await repo.create({ title: 'Validated', description: null, status: 'validated' });
    await repo.create({ title: 'Draft 2', description: null, status: 'draft' });

    const drafts = await repo.findByStatus('draft');
    expect(drafts).toHaveLength(2);

    const validated = await repo.findByStatus('validated');
    expect(validated).toHaveLength(1);
    expect(validated[0]?.title).toBe('Validated');
  });

  test('searches treatments by title and description', async () => {
    await setupRepo('test-repo-search');

    await repo.create({ title: 'Data Processing', description: 'Employee data', status: 'draft' });
    await repo.create({ title: 'Marketing', description: 'Newsletter processing', status: 'draft' });
    await repo.create({ title: 'HR Records', description: null, status: 'draft' });

    const results = await repo.search('processing');
    expect(results).toHaveLength(2);

    const hrResults = await repo.search('HR');
    expect(hrResults).toHaveLength(1);
  });
});
