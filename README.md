# Nexus Dashboard

Internal dashboard for the Nexus instance: sessions/tasks charts,
user and task lists. Angular 22 SPA, served by nginx.

## Develop (docker only — no Node on the host)

```bash
docker compose up dev       # http://localhost:4200, hot reload
docker compose build dev    # only after changing package.json
```

The dev server needs your local endpoint file first, set
the Nexus ws URL there:

```bash
cp src/environments/environment.local.ts.example \
   src/environments/environment.local.ts
```

The legacy `nxjs.js` browser client is loaded as a global from
`public/assets`.

## Build

The nexus URL is never committed.

```bash
docker build --build-arg ENV=int --build-arg NEXUS_URL=ws://… \
  -t nexus-dashboard .                                   # integration
docker build --build-arg ENV=production --build-arg NEXUS_URL=wss://… \
  -t nexus-dashboard .                                   # production
```

## Test

```bash
docker compose run --rm dev npm test
```
