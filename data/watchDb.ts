import { brightGreen } from '../deps.ts';

export async function* watchDb(
  dbPath: string,
  { signal }: Partial<{ signal: AbortSignal }>
) {
  console.log(brightGreen(`Watching for changes to ${dbPath}...`));
  if (signal?.aborted) return;
  const watcher = Deno.watchFs(dbPath);
  !signal?.aborted &&
    signal?.addEventListener('abort', () => {
      watcher.return?.();
    });
  if (signal?.aborted) return;
  for await (const event of watcher) {
    console.log(event);
    if (event.kind === 'modify') {
      yield;
    }
  }
}
