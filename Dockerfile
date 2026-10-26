# nexus-dashboard — Angular 22.
# The whole toolchain (build AND dev server) lives in docker; the host
# only needs docker.
#
#   image build:  docker build --build-arg ENV=int \
#                        --build-arg NEXUS_URL=ws://… -t nexus-dashboard .
#   dev server:   docker compose up dev    (hot reload on :4200)

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG ENV=int
# The nexus URL is never committed: it is injected at image build and
# written to the gitignored environment.local.ts, overriding any local
# copy that leaked into the build context.
ARG NEXUS_URL
RUN test -n "$NEXUS_URL" \
    || { echo "NEXUS_URL build-arg is required" >&2; exit 1; }
RUN printf 'export const host = "%s";\n' "$NEXUS_URL" \
    > src/environments/environment.local.ts
RUN npm run build -- --configuration=${ENV}

# Development server: ng serve with hot reload on http://localhost:4200.
# The vite transform cache (node_modules/.vite, /app/.angular) goes stale
# across restarts when src/ is bind-mounted from the host, so it is wiped
# on every container start.
FROM node:22-alpine AS dev
WORKDIR /app
# No analytics prompt: it would try to write the read-only angular.json.
ENV NG_CLI_ANALYTICS=false
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4200
CMD ["sh", "-c", "rm -rf node_modules/.vite /app/.angular && npm run start -- --host=0.0.0.0 --port=4200"]

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/nexus-dashboard/browser /var/www
EXPOSE 80
