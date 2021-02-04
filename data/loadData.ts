import { watchDb } from './watchDb.ts';

const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String;

export const loadDatabase = async <T>(
  dbPathOrObject: string | T,
  options?: Partial<{ signal: AbortSignal }>
) => {
  if (isString(dbPathOrObject)) {
    const worker = new Worker(new URL('worker.ts', import.meta.url).href, {
      type: 'module',
      deno: true,
    });
    options?.signal?.addEventListener('abort', () => {
      worker?.terminate();
      console.log('Terminated the worker early.');
    });
    const waitForWorker = new Promise<T>((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data as T);
      };
      worker.onerror = reject;
    });
    worker.postMessage(dbPathOrObject);
    const result = await waitForWorker;
    worker?.terminate();
    return result;
  }
  return dbPathOrObject;
};

export async function* loadDatabaseWithUpdates<T>(
  dbPath: string,
  options?: Partial<{ signal: AbortSignal }>
) {
  const signal = options?.signal;

  yield await loadDatabase<T>(dbPath, { signal });

  for await (const _event of watchDb(dbPath, { signal })) {
    yield await loadDatabase<T>(dbPath, { signal });
  }
}
