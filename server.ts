import { ServerRequest } from './deps.ts';
import { listenAndServe } from './listenAndServe.ts';
const { readTextFile } = Deno;

const handleRequest = (db: Record<string, unknown>) => (
  request: ServerRequest
) => {
  const firstPart = request.url.split('/')[1];
  console.log(request.url, firstPart, db[firstPart]);
  if (!(firstPart in db)) {
    request.respond({ body: `${firstPart} not found in db.json!` });
    return;
  } else {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    request.respond({
      body: JSON.stringify(db[firstPart]),
      headers: headers,
    });
  }
};

const loadDatabase = async (dbPath: string) => {
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
