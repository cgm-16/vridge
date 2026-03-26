---
task: T01
slug: architecture-doc
title: Architecture and env contract document
branch: feat/T01-architecture-doc
agent: app-developer
milestone: 앱 준비
labels: [documentation]
depends_on: []
issue: 2
status: todo
---

# T01 — Architecture and Env Contract Document

## Goal

Add a short architecture/ADR-style document that captures the agreed migration target for vridge.

## Context

- Existing app "ssemtle" runs in k3s behind Traefik and already uses an existing CloudNativePG cluster directly.
- New app "vridge" is being migrated from Vercel into k3s.
- "vridge" must get a separate CloudNativePG cluster named "vridge-db".
- No shared tables, no shared database, no shared credentials with "ssemtle".
- Initial "vridge" DB access is direct to CNPG, without PgBouncer.
- Namespace should be "vridge" unless an existing repo convention strongly requires a suffix like "vridge-prod".
- DB envs should come from the CNPG-generated secret "vridge-db-app".
- App-only secret values should live in a separate secret like "vridge-env".

## Deliverables

1. Add a document under `docs/` that explains:
   - Current state
   - Target state
   - Namespace naming
   - Env contract
   - Explicit non-goals for phase 1
2. Include one simple ASCII diagram for current state and one for target state.
3. Include a section called "Deferred" that explicitly says PgBouncer is not part of phase 1.

## Testing

- No code tests required.
- Ensure the doc is internally consistent with current repository naming.
- If the repo already has ADR conventions, follow them.

## Done When

- A new contributor can understand the migration target and env contract without reading chat history.
- The document is concise, accurate, and references exact names: vridge, vridge-db, vridge-db-app, vridge-env.
