---
task: T02
slug: runtime-config
title: Runtime config validation module
branch: feat/T02-runtime-config
agent: app-developer
milestone: 앱 준비
labels: [app, enhancement]
depends_on: []
issue: 3
status: todo
---

# T02 — Runtime Config Validation

## Goal

Introduce a small, testable runtime configuration module for the vridge app so required env vars are validated explicitly and fail fast.

## Context

- Current known envs:
  - DATABASE_URL
  - DIRECT_URL
  - BETTER_AUTH_SECRET
  - BETTER_AUTH_URL
  - NEXT_PUBLIC_APP_URL
- DATABASE_URL and DIRECT_URL will initially point to the same CNPG URI.
- BETTER_AUTH_SECRET and BETTER_AUTH_URL are runtime values.
- NEXT_PUBLIC_APP_URL is a public URL and may be used at build time as well.
- This task is only about config validation inside the app. Do not change Kubernetes or CI/CD here.

## Requirements

1. Add a config module with typed accessors.
2. Validate required env vars on startup.
3. Keep implementation minimal and aligned with the existing stack:
   - Reuse an existing validation library if present (Zod is available).
   - Otherwise add a tiny dependency only if justified.
   - Or write a small internal validator.
4. Do not log secret values.

## Testing

1. Add tests that fail when a required env var is missing.
2. Add tests that pass with a complete minimal env set.
3. Add tests confirming secret values are not echoed in thrown errors if you can do so cleanly.

## Done When

- The app has a single obvious source of truth for required envs.
- Missing configuration fails early and predictably.
- The tests are fast and isolated.
