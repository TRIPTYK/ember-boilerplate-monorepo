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
export declare class DatabaseWorkerClient implements DatabaseInterface {
  private worker;
  private nextId;
  private pending;
  constructor();
  private send;
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
//# sourceMappingURL=database-worker-client.d.ts.map
