# Security Policy

## Reporting a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/nayarsystems/nexus-dashboard/security/advisories/new)
to report security issues in this repository. Do not open public issues for
security problems.

We will respond as soon as possible. Reports received through other channels
(email, chat, public issues) may be slower to triage.

## Scope

- The application source in `src/` and its build definition (`Dockerfile`,
  `nginx.conf`).
- The CI pipeline in `.github/workflows/`.

The backend Nexus instance this dashboard connects to is out of scope.
