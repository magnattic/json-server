import { assertEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts';
import { findPathInDb } from './findPathInDb.ts';

const { test } = Deno;

test({
  name: 'match simple path',
  fn: () => {
    const db = { test: { levelTwo: '1' } };

    const matched = findPathInDb(db, ['test', 'levelTwo']);

    assertEquals(matched, '1');
  },
});

test({
  name: 'match ids',
  fn: () => {
    const db = { test: { id: 3, levelTwo: '1' } };

    const matched = findPathInDb(db, ['test', '3']);

    assertEquals(matched, { id: 3, levelTwo: '1' });
  },
});

test({
  name: 'match simple rewritten path',
  fn: () => {
    const db = { test: { levelTwo: '1' } };

    const matched = findPathInDb(db, ['yolo'], {
      yolo: ['test', 'levelTwo'],
    });

    assertEquals(matched, '1');
  },
});
