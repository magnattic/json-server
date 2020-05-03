import { assertEquals } from './test_deps.ts';
import { listenAndServe } from './listenAndServe.ts';
import { ServerRequest } from './deps.ts';
const { test } = Deno;

test({
  name: 'server test',
  fn: async () => {
    const server = listenAndServe({ port: 8000 }, (req: ServerRequest) =>
      req.respond({ body: 'Hello world!' })
    );
    const response = await fetch('http://localhost:8000');
    assertEquals(await response.text(), 'Hello world!');
    server.close();
  },
});
