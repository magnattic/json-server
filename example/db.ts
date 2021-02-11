import { sample } from '../deps.ts';

const db = {
  profile: { user: sample(['magnattic', 'stinson']) },
  posts: [
    { id: 1, title: 'json-server', body: 'something long' },
    { id: 2, title: 'another one', body: 'this is fun' },
  ],
  comments: [{ id: 1, body: 'some comment', postId: 1 }],
};
export default db;
