import { jsonServer } from './server.ts';
import { assertEquals } from './test_deps.ts';
import { loadDatabase } from './data/loadData.ts';

const { test } = Deno;

const assertJSON = async (actual: Response, expected: unknown) => {
  assertEquals(actual.headers.get('Content-Type'), 'application/json');
  assertEquals(await actual.json(), expected);
};

test({
  name: 'serve a whole json db',
  fn: async () => {
    const db = await loadDatabase('./example/db.json');
    const server = await jsonServer({
      dbPathOrObject: './example/db.json',
      port: 8001,
      watchDB: false,
    });

    const response = await fetch('http://localhost:8001');

    await assertJSON(response, db);
    server.close();
  },
});

test({
  name: 'load a json object db',
  fn: async () => {
    const db = { test: 'epic' };
    const server = await jsonServer({ dbPathOrObject: db });

    const response = await fetch('http://localhost:8000');

    await assertJSON(response, db);
    server.close();
  },
});

test({
  name: 'serve a route from json file',
  fn: async () => {
    const server = await jsonServer({ dbPathOrObject: './example/db.json' });
    const response = await fetch('http://localhost:8000/profile');

    await assertJSON(response, { user: 'magnattic' });
    server.close();
  },
});

test({
  name: 'route by id',
  fn: async () => {
    const db = {
      posts: [
        { id: 1, title: 'Yucatan' },
        { id: 2, title: 'Alice in Denoland' },
      ],
    };
    const server = await jsonServer({ dbPathOrObject: db });

    const response = await fetch('http://localhost:8000/posts/2');

    await assertJSON(response, db.posts[1]);
    server.close();
  },
});
