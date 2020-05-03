import { HTTPOptions, serve, Server, ServerRequest } from './deps.ts';

export function listenAndServe(
  addr: string | HTTPOptions,
  handler: (req: ServerRequest) => void
): Server {
  const server = serve(addr);

  const handleRequests = async () => {
    for await (const request of server) {
      handler(request);
    }
  };
  handleRequests();
  return server;
}
