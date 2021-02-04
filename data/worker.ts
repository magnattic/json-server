const { readTextFile } = Deno;

const worker: Worker = self as any;

const isString = (value: unknown) =>
  typeof value === 'string' || value instanceof String;

const loadFromPath = async (dbPath: string) => {
  if (dbPath.endsWith('.json')) {
    const dbString = await readTextFile(dbPath);
    return JSON.parse(dbString) as Object;
  }
  if (dbPath.endsWith('.ts')) {
    const module = await import(`file://${Deno.cwd()}/${dbPath}`);
    return (module.default as Object) || (module.db as Object);
  }
  throw new Error(`Unsupported database type: ${dbPath}`);
};

worker.onmessage = async (e) => {
  const db = await loadFromPath(e.data as string);
  worker.postMessage(db);

  setTimeout(() => self.close(), 0);
};
