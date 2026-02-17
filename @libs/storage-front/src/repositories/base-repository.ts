import type { DatabaseInterface } from "#src/core/database-worker-client.ts";
import type { EntityDefinition } from "#src/entities/define-entity.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class BaseRepository<T extends {}> {
  constructor(
    protected db: DatabaseInterface,
    protected entity: EntityDefinition<T>,
  ) {}

  async findAll(): Promise<T[]> {
    return this.db.query<T>(`SELECT * FROM ${this.entity.tableName}`);
  }

  async findById(id: string): Promise<T | undefined> {
    const results = await this.db.query<T>(
      `SELECT * FROM ${this.entity.tableName} WHERE id = ?`,
      [id],
    );
    return results[0];
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    const columns = Object.keys(record as Record<string, unknown>);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map(
      (col) => (record as Record<string, unknown>)[col] as SQLiteCompatibleType,
    );

    await this.db.execute(
      `INSERT INTO ${this.entity.tableName} (${columns.join(", ")}) VALUES (${placeholders})`,
      values,
    );

    return record;
  }

  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
  ): Promise<T | undefined> {
    const now = new Date().toISOString();
    const updates = { ...data, updatedAt: now } as Record<string, unknown>;

    const setClauses = Object.keys(updates)
      .map((col) => `${col} = ?`)
      .join(", ");
    const values = [...(Object.values(updates) as SQLiteCompatibleType[]), id];

    await this.db.execute(
      `UPDATE ${this.entity.tableName} SET ${setClauses} WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const changes = await this.db.execute(
      `DELETE FROM ${this.entity.tableName} WHERE id = ?`,
      [id],
    );
    return changes > 0;
  }

  async count(): Promise<number> {
    const result = await this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.entity.tableName}`,
    );
    return result[0]?.count ?? 0;
  }
}
