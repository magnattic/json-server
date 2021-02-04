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
      console.log('killing fs watcher!');
      watcher.return?.();
    });
  for await (const event of watcher) {
    console.log(event);
    if (event.kind === 'modify') {
      yield;
    }
  }
}
