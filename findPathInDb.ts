import { JsonDB } from './server.ts';

export const findPathInDb = (
  db: JsonDB,
  routePaths: string[],
  rewriteRules?: Record<string, string[]>
) => {
  const matchedRewriteKey =
    rewriteRules &&
    Object.keys(rewriteRules).find(
      (rewriteKey) => rewriteKey === routePaths.join('/')
    );
  const appliedRoutePaths = matchedRewriteKey
    ? rewriteRules![matchedRewriteKey]
    : routePaths;
  return appliedRoutePaths.reduce((subDB, routePart) => {
    if (routePart == null || routePart === '') {
      return subDB;
    }
    const id = Number(routePart);
    if (Array.isArray(subDB) && id !== NaN) {
      return (subDB as { id: number }[]).find(
        (item) => item.id === id
      ) as Record<string, unknown>;
    }
    if (routePart && routePart in subDB) {
      return subDB[routePart] as Record<string, unknown>;
    }
    console.error(`${routePart} not found in ${JSON.stringify(subDB)}!`);
    return subDB;
  }, db);
};
