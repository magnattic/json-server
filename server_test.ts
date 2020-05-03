import { jsonServer } from './server.ts';
import { assertEquals } from './test_deps.ts';
const { test } = Deno;

test({
  name: 'json server test',
  fn: async () => {
    const server = await jsonServer('./example/db.json');
    const response = await fetch('http://localhost:8000/profile');

    assertEquals(response.headers.get('Content-Type'), 'application/json');
    assertEquals(await response.json(), { hello: 'world' });
    server.close();
  },
});
