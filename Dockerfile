# The prototype as one self-contained image: it runs on any container host,
# with nothing outside it (ADR 0006).
FROM node:22-alpine AS base
RUN corepack enable pnpm

FROM base AS build
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/domain/package.json packages/domain/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @supersoft/web build
# public/ links to the workshop documents in docs/; the image carries the files themselves.
RUN cp -rL apps/web/public /public

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /public ./apps/web/public
USER node
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
