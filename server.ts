import { ServerRequest, parse, exists } from './deps.ts';
import { listenAndServe } from './listenAndServe.ts';
import { loadDatabase } from './data/loadData.ts';

export type JsonDB = Record<string, unknown>;

const handleRequest = (db: Record<string, unknown>) => (
  request: ServerRequest
) => {
  const [, ...routePaths] = request.url.split('/');

  const resource = routePaths.reduce<Record<string, unknown>>(
    (subDB, routePart) => {
      if (routePart == null || routePart === '') {
        return subDB;
      }
      const id = Number(routePart);
      if (Array.isArray(subDB) && id !== NaN) {
        return (subDB as { id: number }[]).find(
          (item) => item.id === id
        ) as Record<string, unknown>;
      }
      if (routePart && routePart in subDB) {
        return subDB[routePart] as Record<string, unknown>;
      }
      console.error(`${routePart} not found in ${JSON.stringify(subDB)}!`);
      return subDB;
    },
    db
  );

  const origin = request.headers.get('origin');
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `${origin}`,
  });
  request.respond({
    body: JSON.stringify(resource || db, null, 2),
    headers: headers,
  });
};

export const jsonServer = async (
  dbPathOrObject: string | Object = './db.json',
  port = 8000
) => {
  const db = await loadDatabase(dbPathOrObject);
  const server = listenAndServe({ port }, handleRequest(db));
  console.log(`JSON server is running on Port ${port}`);
  return server;
};

export const parseArgs = async () => {
  const parsedArgs = parse(Deno.args);
  const dbPath = parsedArgs._[0]?.toString() || './db.json';
  if (!(await exists(dbPath))) {
    console.error(`Invalid database file: ${dbPath} was not found!`);
    Deno.exit(1);
  }
  const watchDB = parsedArgs['watch'] || true;
  return { dbPath, watchDB };
};

if (import.meta.main) {
  const { dbPath, watchDB } = await parseArgs();
  let server = await jsonServer(dbPath);
  if (watchDB) {
    console.log(`watching for changes to ${dbPath}...`);
    const watcher = Deno.watchFs(dbPath);
    for await (const event of watcher) {
      if (event.kind === 'modify') {
        server.close();
        server = await jsonServer(dbPath);
      }
    }
  }
}
