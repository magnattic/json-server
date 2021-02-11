import { loadDatabase, loadDatabaseWithUpdates } from './data/loadData.ts';
import { exists, parse, ServerRequest } from './deps.ts';
import { handleRequest } from './handleRequest.ts';
import { listenAndServe } from './listenAndServe.ts';

export type JsonDB = Record<string, unknown>;
export type RewriteRules = Record<string, string[]>;

const isString = (value: unknown) =>
  typeof value === 'string' || value instanceof String;

export interface Options {
  dbPathOrObject: string | JsonDB;
  port: number;
  watchDB: boolean;
  rewriteRules: RewriteRules;
}

const defaultOptions: Options = {
  dbPathOrObject: './db.json',
  port: 8000,
  watchDB: true,
  rewriteRules: { yolo: ['profile', 'user'] },
};

export const jsonServer = async (options: Partial<Options>) => {
  const { dbPathOrObject, port, watchDB, rewriteRules } = {
    ...defaultOptions,
    ...options,
  };

  let handler = (req: ServerRequest) => {
    req.respond({ body: 'loading...' });
  };
  const server = listenAndServe({ port }, (req) => handler(req));
  console.log(`JSON server is running on Port ${port}`);

  const handleNewDb = (db: JsonDB) => {
    handler = handleRequest(db, rewriteRules);
  };
  const aborter = new AbortController();
  const { signal } = aborter;

  const db = await loadDatabase(dbPathOrObject, { signal });
  handleNewDb(db);

  const run = async () => {
    if (watchDB && isString(dbPathOrObject)) {
      const dbPath = dbPathOrObject as string;
      for await (const db of loadDatabaseWithUpdates<JsonDB>(dbPath, {
        signal,
      })) {
        handleNewDb(db);
      }
    }
  };
  run();

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
  const testRun = parsedArgs['testRun'] || false;
  return { dbPath, watchDB, port, testRun };
};

if (import.meta.main) {
  console.clear();
  const cliArgs = await parseArgs();
  const server = await jsonServer({
    dbPathOrObject: cliArgs.dbPath,
    port: cliArgs.port,
    watchDB: cliArgs.watchDB,
  });
  if (cliArgs.testRun) {
    console.log('testRun flag detected, closing the server...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    server.close();
  }
}
