import { assertEquals, assertArrayContains } from '../test_deps.ts';
import { loadDatabase } from './loadData.ts';
const { test } = Deno;

test({
  name: 'loads db from json file',
  fn: async () => {
    const db = await loadDatabase('./example/db.json');

    assertEquals(db.profile, { user: 'magnattic' });
  },
});

test({
  name: 'loads db from typescript file',
  fn: async () => {
    const db = await loadDatabase('../example/db.ts');

    assertArrayContains(['magnattic', 'stinson'], [db.profile.user]);
  },
});

test({
  name: 'loads db from json object',
  fn: async () => {
    const dbObj = { geronimo: 'jack' };

    const db = await loadDatabase(dbObj);

    assertEquals(db, dbObj);
  },
});
