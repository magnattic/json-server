const { readTextFile } = Deno;

const isString = (value: unknown) =>
  typeof value === 'string' || value instanceof String;

const loadFromPath = async (dbPath: string) => {
  if (dbPath.endsWith('.json')) {
    const dbString = await readTextFile(dbPath);
    return JSON.parse(dbString);
  }
  if (dbPath.endsWith('.ts')) {
    const module = await import(dbPath);
    return module.default || module.db;
  }
};

export const loadDatabase = async (dbPathOrObject: string | Object) => {
  if (isString(dbPathOrObject)) {
    return await loadFromPath(dbPathOrObject as string);
  }
  return dbPathOrObject;
};
