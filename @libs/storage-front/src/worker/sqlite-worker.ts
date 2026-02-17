import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite-async.mjs";
import wasmUrl from "wa-sqlite/dist/wa-sqlite-async.wasm?url";
import * as SQLite from "wa-sqlite";
import { OPFSCoopSyncVFS } from "wa-sqlite/src/examples/OPFSCoopSyncVFS.js";

const { SQLITE_ROW } = SQLite;

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

let sqlite3: ReturnType<typeof SQLite.Factory> | null = null;
let db: number | null = null;

async function handleInitialize(dbName: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const module = await SQLiteESMFactory({
    locateFile: () => wasmUrl,
  });
  sqlite3 = SQLite.Factory(module);

  const vfs = await OPFSCoopSyncVFS.create(dbName, module);
  sqlite3.vfs_register(
    vfs as unknown as Parameters<typeof sqlite3.vfs_register>[0],
    true,
  );
  db = await sqlite3.open_v2(dbName);
}

async function handleExec(sql: string): Promise<void> {
  if (!sqlite3 || db === null) throw new Error("Database not initialized");
  await sqlite3.exec(db, sql);
}

async function handleCreateTable(entity: {
  tableName: string;
  columns: Record<
    string,
    {
      sqlType: string;
      isPrimary: boolean;
      isNullable: boolean;
      defaultValue?: string | number | boolean;
      isAutoIncrement: boolean;
    }
  >;
}): Promise<void> {
  if (!sqlite3 || db === null) throw new Error("Database not initialized");
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
  await sqlite3.exec(db, sql);
}

async function handleExecute(
  sql: string,
  params: unknown[] = [],
): Promise<number> {
  if (!sqlite3 || db === null) throw new Error("Database not initialized");
  for await (const stmt of sqlite3.statements(db, sql)) {
    if (params.length)
      sqlite3.bind_collection(
        stmt,
        params as Parameters<typeof sqlite3.bind_collection>[1],
      );
    await sqlite3.step(stmt);
  }
  return sqlite3.changes(db);
}

async function handleQuery<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (!sqlite3 || db === null) throw new Error("Database not initialized");
  const rows: unknown[][] = [];
  let columns: string[] = [];
  for await (const stmt of sqlite3.statements(db, sql)) {
    if (params.length)
      sqlite3.bind_collection(
        stmt,
        params as Parameters<typeof sqlite3.bind_collection>[1],
      );
    while ((await sqlite3.step(stmt)) === SQLITE_ROW) {
      if (!columns.length) columns = sqlite3.column_names(stmt);
      rows.push(sqlite3.row(stmt));
    }
  }
  if (!rows.length) return [];
  return rows.map((row: unknown[]) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

async function handleClose(): Promise<void> {
  if (sqlite3 && db !== null) {
    await sqlite3.close(db);
    sqlite3 = null;
    db = null;
  }
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, method, args } = event.data;
  const response: WorkerResponse = { id };
  try {
    switch (method) {
      case "initialize":
        await handleInitialize(args[0] as string);
        break;
      case "exec":
        await handleExec(args[0] as string);
        break;
      case "createTable":
        await handleCreateTable(
          args[0] as Parameters<typeof handleCreateTable>[0],
        );
        break;
      case "execute":
        response.result = await handleExecute(
          args[0] as string,
          (args[1] as unknown[]) ?? [],
        );
        break;
      case "query":
        response.result = await handleQuery(
          args[0] as string,
          (args[1] as unknown[]) ?? [],
        );
        break;
      case "close":
        await handleClose();
        break;
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (e) {
    response.error = e instanceof Error ? e.message : String(e);
  }
  self.postMessage(response);
};

export default null;
