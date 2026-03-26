---
task: T04
slug: containerization
title: Production containerization
branch: feat/T04-containerization
agent: infra-engineer
milestone: 인프라 구성
labels: [infra, enhancement]
depends_on: [T02, T03]
issue: 5
status: todo
---

# T04 — Production Containerization

## Goal

Add a production-ready container build for vridge so it can run in k3s instead of Vercel.

## Context

- The target deployment model is self-hosted in k3s behind Traefik.
- The app should run as a standard production web container.
- NEXT_PUBLIC_APP_URL may need to be provided at build time.
- The existing ssemtle workflow builds and pushes a Docker image; vridge needs the same capability.

## Requirements

1. Add or improve:
   - Dockerfile
   - .dockerignore
   - Production start command
2. Prefer a multi-stage build if the stack supports it cleanly.
3. Run as non-root in the final image if practical.
4. Make build-time handling of NEXT_PUBLIC_APP_URL explicit.
5. Do not bake secrets like DATABASE_URL or BETTER_AUTH_SECRET into the image.

## Testing

1. Add the smallest useful test/validation for the container path:
   - Successful production build
   - Or a repo-standard smoke check proving the production server can start
2. If the repo already has a CI test command, integrate with that rather than inventing a parallel system.

## Done When

- Another engineer can build and run the app locally in a production-like container.
- Build-time vs runtime env handling is explicit.
- No runtime secrets are required at image build time except public build args if truly needed.
