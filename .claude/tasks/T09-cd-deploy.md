---
task: T09
slug: cd-deploy
title: CD deploy workflow for k3s
branch: feat/T09-cd-deploy
agent: infra-engineer
milestone: CI/CD 및 배포
labels: [ci, enhancement]
depends_on: [T05, T06, T07, T08]
issue: 10
status: todo
---

# T09 — CD Deploy Workflow

## Goal

Add or adapt the deployment workflow so vridge can be deployed to k3s safely through Helm.

## Context

- Deploy target is k3s.
- Kubeconfig should come from a user-readable path such as /home/ori/.kube/config, not from loosening permissions on /etc/rancher/k3s/k3s.yaml.
- We want safer deployment behavior than the original minimal workflow:
  - Concurrency control
  - Environment scoping if available
  - Explicit helm lint/template validation
  - helm upgrade --install with wait and rollback-oriented flags

## Requirements

1. Add a deploy workflow that:
   - Runs on the intended self-hosted runner label(s)
   - Validates chart render before deploy
   - Deploys with helm upgrade --install
   - Uses explicit --kubeconfig or KUBECONFIG wiring
   - Targets the vridge namespace
2. Add concurrency control to avoid overlapping production deploys.
3. Use Helm flags appropriate for safer rollouts.
4. Keep secrets out of logs.

## Testing

1. Ensure chart validation commands succeed in the workflow.
2. Validate workflow syntax if the repo already supports it.
3. Keep the workflow deploy-focused; do not rebuild the image here if the project already separates build and deploy.

## Done When

- The deployment path is deterministic and explicit.
- The kubeconfig usage is clear and does not rely on unsafe file permissions.
- A reviewer can see how chart validation happens before upgrade.
