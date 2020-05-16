https://github.com/magnattic/json-server/workflows/CI/badge.svg

# json-server

Simple zero-code fake API server for deno, delivering data from a JSON file. Inspired by [typicode/json-server](https://github.com/typicode/json-server)

This project is very much WIP right now. Feel free to propose new features as an issue.

## Getting started

Create a db.json file like the one in the examples folder and then run the server with:

> deno --allow-net --allow-read server.ts ./examples/db.json
