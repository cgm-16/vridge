---
task: T08
slug: ci-build
title: CI image build workflow
branch: feat/T08-ci-build
agent: infra-engineer
milestone: CI/CD 및 배포
labels: [ci, enhancement]
depends_on: [T04]
issue: 103
status: todo
---

# T08 — CI Image Build Workflow

## Goal

Add or update CI so vridge can build and publish a production image in a repeatable way.

## Context

- The existing ssemtle workflow uses GitHub Actions, Docker Buildx, and image push.
- For vridge we want a similarly simple path, but with a few safety improvements:
  - Deterministic tagging
  - Build cache if practical
  - Explicit build-time public URL handling
- This task is only the build workflow. Do not deploy in this task.

## Requirements

1. Add a workflow that:
   - Checks out the repo
   - Builds the production image
   - Pushes it to the chosen registry
   - Tags at least with commit SHA
2. Prefer adding image metadata and cache support if the repo setup makes that straightforward.
3. Make build-time NEXT_PUBLIC_APP_URL handling explicit.
4. Keep permissions minimal.

## Testing

1. Validate workflow syntax using the repo's existing linting if available.
2. If actionlint is not present and easy to add, add it only if it fits the project naturally.
3. Ensure the workflow references the correct Dockerfile and context.

## Done When

- A push to the target branch can produce a deployable image.
- The workflow is focused on build/publish only.
- Build-time public config is explicit and documented.
