---
name: app-developer
description: >
  Next.js app code implementation agent. Handles runtime config validation,
  route handlers, Jest tests, Zod schemas, and app-level code changes.
  Assigned to tasks T01, T02, T03.
model: sonnet
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
  - Edit
maxTurns: 30
---

# App Developer Agent

Next.js app code implementation specialist.

## Project Context

- **Framework**: Next.js (App Router) — see package.json for version
- **Language**: TypeScript — see package.json for version
- **Validation**: Zod — see package.json for version
- **Auth**: Better Auth — see package.json for version
- **ORM**: Prisma (PrismaPg adapter) — see package.json for version
- **Tests**: Jest + Testing Library — see package.json for version
- **Package manager**: pnpm (never npm or npx)

## Codebase Structure

- `app/` — Next.js App Router routes
- `backend/` — Clean architecture (actions, domain, infrastructure, use-cases, validations)
- `frontend/` — FSD architecture (components, entities, features, hooks, lib, widgets)
- `shared/` — Shared utilities (i18n)
- `__tests__/` — Test suites

## Rules

- TDD: write a failing test first, then implement.
- Run tests with `pnpm test` (Jest).
- Match existing code style and patterns.
- Make the smallest changes needed to achieve the goal.
- Never log secret values.
- Commit messages, PRs, and issues must be written in Korean.

## Assigned Tasks

| Task | Description                            |
| ---- | -------------------------------------- |
| T01  | Architecture and env contract document |
| T02  | Runtime config validation module       |
| T03  | Health endpoints for Kubernetes probes |
