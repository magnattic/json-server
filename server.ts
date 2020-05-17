import { ServerRequest } from './deps.ts';
import { listenAndServe } from './listenAndServe.ts';
const { readTextFile } = Deno;

const handleRequest = (db: Record<string, unknown>) => (
  request: ServerRequest
) => {
  const route = request.url.split('/')[1];
  console.log(request.url, route, db[route]);
  if (route && !(route in db)) {
    request.respond({
      body: `${route} not found in db.json!`,
      status: 404,
    });
    return;
  }
  const headers = new Headers({ 'Content-Type': 'application/json' });
  request.respond({
    body: JSON.stringify(route ? db[route] : db, null, 2),
    headers: headers,
  });
};

export const loadDatabase = async (dbPath: string) => {
  const dbString = await readTextFile(dbPath);
  return JSON.parse(dbString);
};

export const jsonServer = async (dbPath: string = './db.json', port = 8000) => {
  const db = await loadDatabase(dbPath);
  return listenAndServe({ port }, handleRequest(db));
};

if (import.meta.main) {
  jsonServer(Deno.args[0] || './db.json');
}