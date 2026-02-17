import type { ColumnDefinition } from "#src/entities/define-entity.ts";
export interface DatabaseInterface {
  initialize(dbName: string): Promise<void>;
  createTable(entity: {
    tableName: string;
    columns: Record<string, ColumnDefinition>;
  }): Promise<void>;
  exec(sql: string): Promise<void>;
  execute(sql: string, params?: SQLiteCompatibleType[]): Promise<number>;
  query<T>(sql: string, params?: SQLiteCompatibleType[]): Promise<T[]>;
  close(): Promise<void>;
}
export declare class Database implements DatabaseInterface {
  private sqlite3;
  private db;
  initialize(dbName: string): Promise<void>;
  createTable(entity: {
    tableName: string;
    columns: Record<string, ColumnDefinition>;
  }): Promise<void>;
  exec(sql: string): Promise<void>;
  execute(sql: string, params?: SQLiteCompatibleType[]): Promise<number>;
  query<T>(sql: string, params?: SQLiteCompatibleType[]): Promise<T[]>;
  close(): Promise<void>;
  private ensureOpen;
}
//# sourceMappingURL=database.d.ts.map
