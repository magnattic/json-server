import { ServerRequest } from './deps.ts';

export const handleRequest = (db: Record<string, unknown>) => (
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
