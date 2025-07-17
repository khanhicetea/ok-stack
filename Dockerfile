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

# RUN apk add --no-cache curl multirun  \
#     && rm -rf /var/cache/apk/* \
#     && curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared \
#     && chmod +x /usr/local/bin/cloudflared

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output

EXPOSE 3000

WORKDIR /app

CMD ["/usr/local/bin/node", ".output/server/index.mjs"]

# ENTRYPOINT ["multirun"]
# CMD ["/usr/local/bin/node .output/server/index.mjs", "/usr/local/bin/cloudflared tunnel --no-autoupdate run"]
