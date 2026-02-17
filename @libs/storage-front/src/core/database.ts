import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite-async.mjs";
import wasmUrl from "wa-sqlite/dist/wa-sqlite-async.wasm?url";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import type { ColumnDefinition } from "#src/entities/define-entity.ts";

export class Database {
  private sqlite3: SQLiteAPI | null = null;
  private db: number | null = null;

  async initialize(dbName: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const module = await SQLiteESMFactory({
      locateFile: () => wasmUrl,
    });
    this.sqlite3 = SQLite.Factory(module);

    const vfs = new IDBBatchAtomicVFS(dbName);
    this.sqlite3.vfs_register(vfs as unknown as SQLiteVFS, true);

    this.db = await this.sqlite3.open_v2(dbName);
  }

  async createTable(entity: {
    tableName: string;
    columns: Record<string, ColumnDefinition>;
  }): Promise<void> {
    const columnDefs = Object.entries(entity.columns).map(([name, col]) => {
      let def = `${name} ${col.sqlType}`;
      if (col.isPrimary) def += " PRIMARY KEY";
      if (!col.isNullable && !col.isPrimary) def += " NOT NULL";
      if (col.defaultValue !== undefined) {
        const val =
          typeof col.defaultValue === "string"
            ? `'${col.defaultValue}'`
            : col.defaultValue;
        def += ` DEFAULT ${String(val)}`;
      }
      return def;
    });

    const sql = `CREATE TABLE IF NOT EXISTS ${entity.tableName} (${columnDefs.join(", ")})`;
    await this.exec(sql);
  }

  async exec(sql: string): Promise<void> {
    this.ensureOpen();
    await this.sqlite3!.exec(this.db!, sql);
  }

  async execute(
    sql: string,
    params: SQLiteCompatibleType[] = [],
  ): Promise<number> {
    this.ensureOpen();
    await this.sqlite3!.run(this.db!, sql, params);
    return this.sqlite3!.changes(this.db!);
  }

  async query<T>(
    sql: string,
    params: SQLiteCompatibleType[] = [],
  ): Promise<T[]> {
    this.ensureOpen();
    const result = await this.sqlite3!.execWithParams(this.db!, sql, params);

    if (!result.rows.length) return [];

    return result.rows.map((row) => {
      const obj: Record<string, unknown> = {};
      result.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj as T;
    });
  }

  async close(): Promise<void> {
    if (this.sqlite3 && this.db !== null) {
      await this.sqlite3.close(this.db);
      this.sqlite3 = null;
      this.db = null;
    }
  }

  private ensureOpen(): void {
    if (!this.sqlite3 || this.db === null) {
      throw new Error("Database is not initialized. Call initialize() first.");
    }
  }
}
