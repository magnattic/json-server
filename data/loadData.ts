import { brightGreen } from '../deps.ts';

const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String;

export const loadDatabase = (
  dbPathOrObject: string | Object,
  onWorkerCreated: (worker: Worker) => void
) => {
  console.log('yes');
  if (isString(dbPathOrObject)) {
    const worker = new Worker(new URL('worker.ts', import.meta.url).href, {
      type: 'module',
      deno: true,
    });
    onWorkerCreated(worker);
    const waitForWorker = new Promise<Object>((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data as Object);
      };
      worker.onerror = reject;
    });
    worker.postMessage(dbPathOrObject);
    waitForWorker.then((x) => console.log('worker reloaded database'));
    return waitForWorker;
  }
  return Promise.resolve(dbPathOrObject);
};

async function* onDbChange(dbPath: string) {
  console.log(brightGreen(`Watching for changes to ${dbPath}...`));
  const watcher = Deno.watchFs(dbPath);
  for await (const ev of watcher) {
    console.log(ev);
    if (ev.kind === 'modify') {
      yield;
    }
  }
}

export async function* loadDatabaseWithUpdates(
  dbPathOrObject: string | Object,
  onWorkerCreated: (worker: Worker) => void
) {
  yield await loadDatabase(dbPathOrObject, onWorkerCreated);
  if (isString(dbPathOrObject)) {
    for await (const x of onDbChange(dbPathOrObject)) {
      yield await loadDatabase(dbPathOrObject, onWorkerCreated);
    }
  }
}
