declare module "wa-sqlite/src/examples/OPFSCoopSyncVFS.js" {
  export class OPFSCoopSyncVFS {
    constructor(name: string, module: unknown);
    static create(name: string, module: unknown): Promise<OPFSCoopSyncVFS>;
    name: string;
    close(): Promise<void>;
  }
}
