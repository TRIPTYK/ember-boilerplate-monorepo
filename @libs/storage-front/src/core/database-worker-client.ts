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

type WorkerRequest = {
  id: number;
  method: string;
  args: unknown[];
};

type WorkerResponse = {
  id: number;
  result?: unknown;
  error?: string;
};

export class DatabaseWorkerClient implements DatabaseInterface {
  private worker: Worker;
  private nextId = 0;
  private pending = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
  >();

  constructor() {
    this.worker = new Worker(
      new URL("../worker/sqlite-worker.js", import.meta.url),
      { type: "module" },
    );
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, result, error } = event.data;
      const pending = this.pending.get(id);
      if (pending) {
        this.pending.delete(id);
        if (error) pending.reject(new Error(error));
        else pending.resolve(result);
      }
    };
    this.worker.onerror = (event) => {
      for (const [, { reject }] of this.pending) {
        reject(event.error ?? new Error("Worker error"));
      }
      this.pending.clear();
    };
  }

  private send<T>(method: string, ...args: unknown[]): Promise<T> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.worker.postMessage({ id, method, args } satisfies WorkerRequest);
    });
  }

  async initialize(dbName: string): Promise<void> {
    await this.send<void>("initialize", dbName);
  }

  async createTable(entity: {
    tableName: string;
    columns: Record<string, ColumnDefinition>;
  }): Promise<void> {
    await this.send<void>("createTable", entity);
  }

  async exec(sql: string): Promise<void> {
    await this.send<void>("exec", sql);
  }

  async execute(
    sql: string,
    params: SQLiteCompatibleType[] = [],
  ): Promise<number> {
    return this.send<number>("execute", sql, params);
  }

  async query<T>(
    sql: string,
    params: SQLiteCompatibleType[] = [],
  ): Promise<T[]> {
    return this.send<T[]>("query", sql, params);
  }

  async close(): Promise<void> {
    await this.send<void>("close");
    this.worker.terminate();
  }
}
