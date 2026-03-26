---
task: T06
slug: helm-secrets
title: Helm secret wiring for CNPG and app secrets
branch: feat/T06-helm-secrets
agent: infra-engineer
milestone: 인프라 구성
labels: [infra, enhancement]
depends_on: [T02, T05]
issue: null
status: todo
---

# T06 — Helm Secret Wiring

## Goal

Teach the vridge Helm chart to consume database config from the CNPG-generated secret and app-only values from a separate secret.

## Context

- CNPG cluster name will be vridge-db.
- CNPG will generate an application secret named vridge-db-app.
- That secret will expose a key named `uri` for the app connection string.
- App-owned secret should be named vridge-env.
- Initial mapping:
  - DATABASE_URL ← vridge-db-app:uri
  - DIRECT_URL ← vridge-db-app:uri
  - BETTER_AUTH_SECRET ← vridge-env
  - BETTER_AUTH_URL ← vridge-env
- NEXT_PUBLIC_APP_URL is expected to be handled at build time, not injected as a runtime secret unless the app truly needs runtime access too.

## Requirements

1. Update the Deployment template to wire:
   - DATABASE_URL from vridge-db-app:uri
   - DIRECT_URL from vridge-db-app:uri
2. Keep app-owned runtime secret injection separate via envFrom or explicit env entries from vridge-env.
3. Make secret names configurable in values, but default to:
   - DB secret: vridge-db-app
   - App secret: vridge-env
4. Do not duplicate DB credentials into the app secret.

## Testing

1. Add chart render tests/assertions that confirm:
   - DATABASE_URL points to secretKeyRef vridge-db-app / uri
   - DIRECT_URL points to secretKeyRef vridge-db-app / uri
   - vridge-env is included for app settings
2. Keep the chart renderable without real secret contents.

## Done When

- The chart expresses the intended secret boundary clearly.
- DB credentials are sourced only from the CNPG-managed secret.
- The app secret stays small and app-specific.
