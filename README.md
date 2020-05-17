# json-server

[![CI](https://github.com/magnattic/json-server/workflows/CI/badge.svg)](https://github.com/magnattic/json-server/actions?query=workflow%3ACI)

Simple zero-code fake API server for deno, delivering data from a JSON file. Inspired by [typicode/json-server](https://github.com/typicode/json-server)

This project is very much WIP right now. Feel free to propose new features as an issue.

## Getting started

Install using deno install

> \$ deno install --allow-read --allow-net -n json-server https://raw.githubusercontent.com/magnattic/json-server/master/server.ts

Create a `db.json` file

```
{
  "profile": { "user": "magnattic" },
  "posts": [
    { "id": 1, "title": "json-server" },
    { "id": 2, "title": "another one" }
  ],
}
```

Run the server

> json-server

That's it, now you have a working json server running on `localhost:8000`!

## Example requests:

> localhost:8000

returns the whole db.json

> localhost:8000/profile

just returns the profile portion

> localhost:8000/posts/2

returns the post with id 2

> localhost:8000/posts/2/title

returns the title of post with id 2

## Upcoming features

- [ ] deliver from db.ts
- [ ] watch mode to update on changes
- [ ] filter by query params
