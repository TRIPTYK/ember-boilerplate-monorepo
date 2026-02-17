import { afterEach, describe, expect } from 'vitest';
import { test } from 'ember-vitest';
import { DatabaseWorkerClient } from '#src/core/database-worker-client.ts';
import { TreatmentEntity } from '#src/entities/treatment.entity.ts';

describe('Unit | Core | Database', () => {
  let db: DatabaseWorkerClient;

  afterEach(async () => {
    if (db) {
      await db.close();
    }
  });

  test('initializes successfully with IndexedDB VFS', async () => {
    db = new DatabaseWorkerClient();
    await db.initialize('test-db-init');
    // If no error thrown, initialization succeeded
    expect(true).toBe(true);
  });

  test('creates a table from entity definition', async () => {
    db = new DatabaseWorkerClient();
    await db.initialize('test-db-create-table');
    await db.createTable(TreatmentEntity);

    const tables = await db.query<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='treatments'",
    );
    expect(tables).toHaveLength(1);
    expect(tables[0]?.name).toBe('treatments');
  });

  test('executes INSERT and returns change count', async () => {
    db = new DatabaseWorkerClient();
    await db.initialize('test-db-execute');
    await db.createTable(TreatmentEntity);

    const changes = await db.execute(
      "INSERT INTO treatments (id, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      ['test-id', 'Test Title', null, 'draft', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'],
    );
    expect(changes).toBe(1);
  });

  test('queries rows and returns typed results', async () => {
    db = new DatabaseWorkerClient();
    await db.initialize('test-db-query');
    await db.createTable(TreatmentEntity);

    await db.execute(
      "INSERT INTO treatments (id, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      ['q-1', 'Query Test', 'A description', 'draft', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'],
    );

    const results = await db.query<{ id: string; title: string; description: string }>(
      'SELECT id, title, description FROM treatments WHERE id = ?',
      ['q-1'],
    );

    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('q-1');
    expect(results[0]?.title).toBe('Query Test');
    expect(results[0]?.description).toBe('A description');
  });

  test('returns empty array for queries with no results', async () => {
    db = new DatabaseWorkerClient();
    await db.initialize('test-db-empty-query');
    await db.createTable(TreatmentEntity);

    const results = await db.query('SELECT * FROM treatments WHERE id = ?', ['nonexistent']);
    expect(results).toHaveLength(0);
  });

  test('throws when operating on uninitialized database', async () => {
    db = new DatabaseWorkerClient();
    await expect(db.exec('SELECT 1')).rejects.toThrow('Database not initialized');
  });
});
