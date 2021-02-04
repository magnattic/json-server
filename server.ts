import { loadDatabaseWithUpdates } from './data/loadData.ts';
import { exists, parse, ServerRequest } from './deps.ts';
import { handleRequest } from './handleRequest.ts';
import { listenAndServe } from './listenAndServe.ts';

export type JsonDB = Record<string, unknown>;
export interface Options {
  dbPathOrObject: string | JsonDB;
  port: number;
  watchDB: boolean;
}

const defaultOptions: Options = {
  dbPathOrObject: './db.json',
  port: 8000,
  watchDB: true,
};

export const jsonServer = async (options: Partial<Options>) => {
  console.clear();
  const { dbPathOrObject, port } = { ...defaultOptions, ...options };

  let handler = (_req: ServerRequest) => {};
  const server = listenAndServe({ port }, (req) => handler(req));
  console.log(`JSON server is running on Port ${port}`);

  const handleNewDb = (db: Object) => {
    handler = handleRequest(db as Record<string, unknown>);
  };
  const aborter = new AbortController();
  const { signal } = aborter;

  const run = async () => {
    for await (const db of loadDatabaseWithUpdates(dbPathOrObject, signal)) {
      handleNewDb(db);
    }
  };
  await run();

  return {
    close: () => {
      aborter.abort();
      server.close();
      console.log('Server was closed.');
    },
  };
};

export const parseArgs = async () => {
  const parsedArgs = parse(Deno.args);
  const dbPath = parsedArgs._[0]?.toString() || './db.json';
  if (!(await exists(dbPath))) {
    console.error(`Invalid database file: ${dbPath} was not found!`);
    Deno.exit(1);
  }
  const watchDB = parsedArgs['watch'] || true;
  const port = parsedArgs['port'] || 8000;
  return { dbPath, watchDB, port };
};

if (import.meta.main) {
  const cliArgs = await parseArgs();
  await jsonServer({
    dbPathOrObject: cliArgs.dbPath,
    port: cliArgs.port,
    watchDB: cliArgs.watchDB,
  });
}
