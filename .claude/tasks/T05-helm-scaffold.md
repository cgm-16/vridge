---
task: T05
slug: helm-scaffold
title: Helm chart scaffold with safe defaults
branch: feat/T05-helm-scaffold
agent: infra-engineer
milestone: 인프라 구성
labels: [infra, enhancement]
depends_on: []
issue: null
status: todo
---

# T05 — Helm Chart Scaffold

## Goal

Create or adapt a Helm chart for vridge with safe defaults and improved chart structure based on lessons from the ssemtle chart review.

## Context

- We want a chart for a web app behind Traefik.
- Known best-practice improvements from earlier review:
  - Do not hard-code namespace in values.yaml
  - Use .Release.Namespace instead
  - Honor service.type in the Service template
  - Use standard app.kubernetes.io labels
  - Support resource requests/limits
  - Include a PodDisruptionBudget
  - Keep securityContext and seccomp support
  - Make ingress configurable
- Secret wiring for CNPG should be handled in a later task (T06).

## Requirements

1. Add a chart for vridge or adapt the existing chart structure for reuse.
2. Include:
   - Deployment
   - Service
   - Ingress
   - PodDisruptionBudget
   - values.yaml with sane defaults
3. Do not render metadata.namespace from values.
4. Ensure the Service template actually renders spec.type.
5. Use standard labels consistently in selectors and pod labels.
6. Keep probes configurable in values.

## Testing

1. Add chart validation using `helm lint`.
2. Add at least one rendered-template assertion path:
   - Either `helm template` plus a small script
   - Or an existing chart test setup if the repo already has one
3. Verify rendered output includes:
   - Service type
   - Ingress class
   - Consistent selector labels

## Done When

- The chart renders cleanly with default values.
- The chart structure is safer than the original ssemtle version we reviewed.
- Namespace is controlled by Helm release namespace, not a custom values field.
