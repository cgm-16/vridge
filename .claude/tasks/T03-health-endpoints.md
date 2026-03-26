---
task: T03
slug: health-endpoints
title: Health endpoints for Kubernetes probes
branch: feat/T03-health-endpoints
agent: app-developer
milestone: 앱 준비
labels: [app, enhancement]
depends_on: []
issue: 4
status: todo
---

# T03 — Health Endpoints for Kubernetes Probes

## Goal

Add lightweight /healthz and /readyz endpoints to the vridge app for Kubernetes liveness, readiness, and startup probes.

## Context

- The existing Helm pattern uses:
  - /healthz for liveness/startup
  - /readyz for readiness
- The app will run in Kubernetes with rolling updates.
- These endpoints should be cheap, deterministic, and should not introduce unnecessary DB pressure.

## Requirements

1. Implement /healthz returning 200 when the app process is alive.
2. Implement /readyz returning 200 when the app is ready to serve HTTP traffic.
3. Keep readiness logic lightweight:
   - Do not require a live database query in phase 1 unless the app already has a strong built-in readiness mechanism.
4. Return simple machine-readable bodies if that fits the framework conventions.
5. Keep the implementation framework-native.

## Testing

1. Add endpoint tests verifying:
   - /healthz returns 200
   - /readyz returns 200 in the normal app startup path
2. Keep tests fast and isolated from external services.

## Done When

- These routes exist in production code.
- They are safe to use in Kubernetes probes.
- Tests cover the success path.
