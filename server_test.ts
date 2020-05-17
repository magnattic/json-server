import { jsonServer, loadDatabase } from './server.ts';
import { assertEquals } from './test_deps.ts';

const { test } = Deno;

const assertJSON = async (actual: Response, expected: unknown) => {
  assertEquals(actual.headers.get('Content-Type'), 'application/json');
  assertEquals(await actual.json(), expected);
};

test({
  name: 'load whole db',
  fn: async () => {
    const db = await loadDatabase('./example/db.json');
    const server = await jsonServer('./example/db.json', 8001);

    const response = await fetch('http://localhost:8001');

    await assertJSON(response, db);
    server.close();
  },
});

test({
  name: 'load a json object db',
  fn: async () => {
    const db = { test: 'epic' };
    const server = await jsonServer(db);

    const response = await fetch('http://localhost:8000');

    await assertJSON(response, db);
    server.close();
  },
});

test({
  name: 'load profile from db',
  fn: async () => {
    const server = await jsonServer('./example/db.json');
    const response = await fetch('http://localhost:8000/profile');

    await assertJSON(response, { hello: 'world' });
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
    const server = await jsonServer(db);

    const response = await fetch('http://localhost:8000/posts/2');

    await assertJSON(response, db.posts[1]);
    server.close();
  },
});
