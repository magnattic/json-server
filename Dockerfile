FROM hayd/deno:latest


WORKDIR /app

EXPOSE 8000

# Prefer not to run as root.
USER deno

WORKDIR /app

ADD test_deps.ts .
RUN deno cache --unstable test_deps.ts

ADD deps.ts .
RUN deno cache --unstable deps.ts

# These are passed as deno arguments when run with docker:
CMD ["run", "--unstable",  "--allow-net", "--allow-read", "./server.ts", "./example/db.json"]
# CMD ["test", "--unstable",  "--allow-net", "--allow-read"]