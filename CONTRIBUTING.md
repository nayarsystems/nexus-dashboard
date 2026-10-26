# Contributing

Thanks for your interest in contributing.

## How to submit changes

1. Open a pull request.
2. CI runs on your PR: a secret scan, unit tests and a docker build
   (build-only — nothing is published from pull requests).
3. A maintainer reviews and merges.

## Notes

- The stack is Angular 22; the whole toolchain (build and dev server)
  lives inside the `Dockerfile` and `docker-compose.yml` — you don't
  need Node installed locally. See the README for dev, test and build
  instructions (`docker compose up dev` etc.).
- Local development needs your nexus endpoint file first:
  `cp src/environments/environment.local.ts.example
  src/environments/environment.local.ts` and set your nexus ws URL.
- Format TypeScript with the repo prettier config (`.prettierrc`).
- Keep commits in the Conventional Commits style when practical
  (`feat:`, `fix:`, `chore:`, ...).
- By contributing you agree your contributions are licensed under the MIT
  license (see `LICENSE`).
