import type { EntityDefinition } from "#src/entities/define-entity.ts";
export declare class Database {
  private sqlite3;
  private db;
  initialize(dbName: string): Promise<void>;
  createTable(entity: EntityDefinition): Promise<void>;
  exec(sql: string): Promise<void>;
  execute(sql: string, params?: SQLiteCompatibleType[]): Promise<number>;
  query<T>(sql: string, params?: SQLiteCompatibleType[]): Promise<T[]>;
  close(): Promise<void>;
  private ensureOpen;
}
//# sourceMappingURL=database.d.ts.map
