import { assertEquals, assertArrayIncludes } from '../test_deps.ts';
import { loadDatabase } from './loadData.ts';
const { test } = Deno;

interface TestDb {
  profile: { user: string };
  posts: { id: number; title: string; body: string }[];
  comments: { id: number; body: string; postId: number }[];
}

test({
  name: 'loads db from json file',
  fn: async () => {
    const db = (await loadDatabase('./example/db.json', () => {})) as TestDb;

    assertEquals(db.profile, { user: 'magnattic' });
  },
});

test({
  name: 'loads db from typescript file',
  fn: async () => {
    const db = (await loadDatabase('./example/db.ts', () => {})) as TestDb;

    assertArrayIncludes(['magnattic', 'stinson'], [db.profile.user]);
  },
});

test({
  name: 'loads db from json object',
  fn: async () => {
    const dbObj = { geronimo: 'jack' };

    const db = (await loadDatabase(dbObj, () => {})) as TestDb;

    assertEquals(db, dbObj);
  },
});
