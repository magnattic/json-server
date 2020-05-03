import { serve } from './deps.ts';
const { readTextFile } = Deno;

export const jsonServer = async (dbPath: string = './db.json') => {
  const server = serve({ port: 8000 });
  const dbString = await readTextFile(dbPath);
  const db = JSON.parse(dbString);

  const handleRequests = async () => {
    for await (const request of server) {
      console.log(request.url);
      const firstPart = request.url.split('/')[1];
      console.log(firstPart, db[firstPart]);
      if (!(firstPart in db)) {
        request.respond({ body: `${firstPart} not found in db.json!` });
      } else {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        request.respond({
          body: JSON.stringify(db[firstPart]),
          headers: headers,
        });
      }
    }
  };
  handleRequests();
  return server;
};
