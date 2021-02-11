import { ServerRequest } from './deps.ts';
import { findPathInDb } from './findPathInDb.ts';
import { JsonDB, RewriteRules } from './server.ts';

export const handleRequest = (db: JsonDB, rewriteRules?: RewriteRules) => (
  request: ServerRequest
) => {
  const [, ...routePaths] = request.url.split('/');
  const isFile = routePaths[routePaths.length - 1].includes('.');
  if (isFile) {
    request.respond({
      status: 404,
      body: 'Files are not yet handled',
    });
    return;
  }

  const resource = findPathInDb(db, routePaths, rewriteRules);

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
