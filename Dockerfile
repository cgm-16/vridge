# syntax=docker/dockerfile:1
FROM node:lts-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY backend/prisma ./backend/prisma

RUN pnpm install --frozen-lockfile

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

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI and schema — used by the Helm pre-upgrade migration Job
# --follow-symlinks resolves pnpm virtual store symlinks so deps are real files in the image
COPY --from=deps --follow-symlinks --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --follow-symlinks --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/backend/prisma ./backend/prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
