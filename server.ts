import { ServerRequest, reduce } from './deps.ts';
import { listenAndServe } from './listenAndServe.ts';
const { readTextFile } = Deno;

const handleRequest = (db: Record<string, unknown>) => (
  request: ServerRequest
) => {
  const [, ...routePaths] = request.url.split('/');
  console.log('route', request.url, routePaths);

  const resource = routePaths.reduce<Record<string, unknown>>(
    (subDB, routePart) => {
      console.log('yada', subDB, routePart);
      if (routePart == null || routePart === '') {
        return subDB;
      }
      const id = Number(routePart);
      if (Array.isArray(subDB) && id !== NaN) {
        console.log('yes', id);
        return (subDB as { id: number }[]).find(
          (item) => item.id === id
        ) as Record<string, unknown>;
      }
      if (routePart && routePart in subDB) {
        return subDB[routePart] as Record<string, unknown>;
      }
      throw `${routePart} not found in ${JSON.stringify(subDB)}!`;
    },
    db
  );

  const headers = new Headers({ 'Content-Type': 'application/json' });
  request.respond({
    body: JSON.stringify(resource || db, null, 2),
    headers: headers,
  });
};

export const loadDatabase = async (dbPath: string) => {
  const dbString = await readTextFile(dbPath);
  return JSON.parse(dbString);
};

const isString = (value: unknown) =>
  typeof value === 'string' || value instanceof String;

export const jsonServer = async (
  dbPathOrObject: string | Object = './db.json',
  port = 8000
) => {
  console.log(dbPathOrObject);
  const db = isString(dbPathOrObject)
    ? await loadDatabase(dbPathOrObject as string)
    : dbPathOrObject;
  return listenAndServe({ port }, handleRequest(db));
};

if (import.meta.main) {
  jsonServer(Deno.args[0] || './db.json');
}
