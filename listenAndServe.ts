import { HTTPOptions, serve, Server, ServerRequest } from './deps.ts';

export const handleRequests = async (
  server: Server,
  handler: (req: ServerRequest) => void
) => {
  for await (const request of server) {
    handler(request);
  }
};

export function listenAndServe(
  addr: string | HTTPOptions,
  handler: (req: ServerRequest) => void
): Server {
  const server = serve(addr);

  handleRequests(server, handler);
  return server;
}
