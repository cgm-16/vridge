FROM node:lts-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts .npmrc ./
COPY tools ./tools
COPY backend/prisma ./backend/prisma

RUN pnpm install --frozen-lockfile

# Deploy the migration workspace package into an isolated directory.
# pnpm deploy resolves the complete Prisma transitive dep tree from the workspace lockfile.
# node-linker=hoisted (tools/migration/.npmrc) ensures real directories for Docker COPY.
FROM deps AS prisma-migration-deps
RUN pnpm --filter=migration deploy --prod /migration-install

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY --from=deps /app/backend/generated ./backend/generated

ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}"

RUN pnpm build

FROM node:lts-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI and schema — used by the Deployment initContainer migration step
# Copied from prisma-migration-deps (hoisted linker) so packages are real directories, not pnpm symlinks
COPY --from=prisma-migration-deps --chown=nextjs:nodejs /migration-install/node_modules ./node_modules
COPY --from=deps --chown=nextjs:nodejs /app/backend/prisma ./backend/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
