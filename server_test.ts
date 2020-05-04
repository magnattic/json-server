import { jsonServer, loadDatabase } from './server.ts';
import { assertEquals } from './test_deps.ts';
const { test } = Deno;

test({
  name: 'load profile from db',
  fn: async () => {
    const server = await jsonServer('./example/db.json');
    const response = await fetch('http://localhost:8000/profile');

    assertEquals(response.headers.get('Content-Type'), 'application/json');
    assertEquals(await response.json(), { hello: 'world' });
    server.close();
  },
});

test({
  name: 'load whole db',
  fn: async () => {
    const db = await loadDatabase('./example/db.json');
    const server = await jsonServer('./example/db.json');
    const response = await fetch('http://localhost:8000');

    assertEquals(response.headers.get('Content-Type'), 'application/json');
    assertEquals(await response.json(), db);
    server.close();
  },
});
