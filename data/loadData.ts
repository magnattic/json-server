import { watchDb } from './watchDb.ts';

const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String;

export const loadDatabase = (
  dbPathOrObject: string | Object,
  signal: AbortSignal
) => {
  if (isString(dbPathOrObject)) {
    const worker = new Worker(new URL('worker.ts', import.meta.url).href, {
      type: 'module',
      deno: true,
    });
    signal.addEventListener('abort', () => {
      worker?.terminate();
      console.log('killing the worker');
    });
    const waitForWorker = new Promise<Object>((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data as Object);
      };
      worker.onerror = reject;
    });
    worker.postMessage(dbPathOrObject);
    return waitForWorker;
  }
  return Promise.resolve(dbPathOrObject);
};

export async function* loadDatabaseWithUpdates(
  dbPathOrObject: string | Object,
  signal: AbortSignal
) {
  yield await loadDatabase(dbPathOrObject, signal);
  if (isString(dbPathOrObject)) {
    for await (const _event of watchDb(dbPathOrObject, signal)) {
      yield await loadDatabase(dbPathOrObject, signal);
    }
  }
}
