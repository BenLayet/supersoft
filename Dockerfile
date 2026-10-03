# The platform as one self-contained image: it runs on any container host, with
# nothing outside it but the repositories it reads (ADR 0007).
FROM node:22-alpine AS base
RUN corepack enable pnpm

FROM base AS build
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/domain/package.json packages/domain/
COPY packages/adapters/package.json packages/adapters/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @claree/web build

FROM node:22-alpine AS run
# Projects are read from their repositories, into a cache on the temporary disk.
RUN apk add --no-cache git
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
