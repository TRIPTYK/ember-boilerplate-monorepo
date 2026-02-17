declare module "wa-sqlite/src/examples/IDBBatchAtomicVFS.js" {
  export class IDBBatchAtomicVFS {
    constructor(idbDatabaseName?: string, options?: Record<string, unknown>);
    name: string;
    close(): Promise<void>;
  }
}
