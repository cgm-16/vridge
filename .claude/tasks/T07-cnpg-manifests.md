---
task: T07
slug: cnpg-manifests
title: CNPG cluster and namespace manifests
branch: feat/T07-cnpg-manifests
agent: infra-engineer
milestone: 인프라 구성
labels: [infra, enhancement]
depends_on: []
issue: 8
status: todo
---

# T07 — CNPG Namespace and Cluster Manifests

## Goal

Add the Kubernetes manifests needed to create the vridge namespace and the dedicated CloudNativePG cluster for vridge.

## Context

- Namespace should default to vridge.
- CNPG cluster name should be vridge-db.
- Initial database name should be vridge.
- Initial owner should be vridge.
- Initial phase does not include PgBouncer.
- The purpose is to isolate vridge from ssemtle at the database cluster boundary.

## Requirements

1. Add manifests for:
   - Namespace vridge
   - CNPG Cluster vridge-db
2. Bootstrap the cluster with:
   - database: vridge
   - owner: vridge
3. Choose conservative initial storage and instance defaults suitable for a first rollout.
4. Keep naming aligned with the agreed env/secret contract.
5. Add comments or a short README explaining that CNPG will generate the application secret vridge-db-app.

## Testing

1. Add whatever repo-standard manifest validation is available.
2. If there is no existing manifest validation, add a lightweight static check or documented render/inspection script.
3. Avoid adding fake CRDs just to make validation pass.

## Done When

- The manifests are clean, readable, and consistent with the target architecture.
- A human reviewer can see how the future secret vridge-db-app will be produced.
- No PgBouncer resources are introduced in this task.
