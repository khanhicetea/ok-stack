FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile
COPY . /app
RUN BUILD_TARGET=node-server pnpm run build

FROM node:22-alpine

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output

EXPOSE 3000
WORKDIR /app

CMD ["node", ".output/server/index.mjs"]
