import { ServerRequest } from './deps.ts';
import { listenAndServe } from './listenAndServe.ts';
import { loadDatabase } from './data/loadData.ts';

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

export const jsonServer = async (
  dbPathOrObject: string | Object = './db.json',
  port = 8000
) => {
  const db = await loadDatabase(dbPathOrObject);
  return listenAndServe({ port }, handleRequest(db));
};

if (import.meta.main) {
  jsonServer(Deno.args[0] || './db.json');
}
