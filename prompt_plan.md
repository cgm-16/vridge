Below is a right-sized implementation plan distilled from our conversation.

I split the work so that:

- each task is mergeable on its own,
- the risky parts are isolated,
- testing happens early,
- app code, chart code, database manifests, and automation are not tangled in the same PR.

I also deliberately **deferred PgBouncer** from the first milestone. The current `ssemtle` app already works with direct CNPG access, and adding pooling now would increase complexity without being required for the migration.

## Shared context

We are aligned on these decisions:

- `ssemtle` already runs in **k3s** behind **Traefik** and connects directly to an existing **CloudNativePG** cluster.
- The new app is **`vridge`**.
- `vridge` should move **from Vercel into k3s**.
- `vridge` should get its **own namespace** and **its own CNPG cluster**.
- We are **not** changing the existing `ssemtle` database path.
- We are **not** sharing tables, database, or app credentials between `ssemtle` and `vridge`.
- Initial database connectivity for `vridge` should be **direct to CNPG**, with **no PgBouncer yet**.
- Initial env mapping for `vridge` is:

```text
DATABASE_URL        <- CNPG generated secret vridge-db-app:uri
DIRECT_URL          <- same as DATABASE_URL for now
BETTER_AUTH_SECRET  <- app-managed secret
BETTER_AUTH_URL     <- runtime public URL
NEXT_PUBLIC_APP_URL <- build-time public URL
```

- Kubeconfig access for deploys should use a **user-readable copy** like `/home/ori/.kube/config`, not looser perms on `/etc/rancher/k3s/k3s.yaml`.

## Dependency map

Use this ordering to unlock safe parallel work:

- **T01** Architecture/env contract doc — no deps
- **T02** Runtime config validation — no deps
- **T03** Health endpoints — no deps
- **T04** Production containerization — depends on T02, T03
- **T05** Helm chart scaffold for `vridge` — no deps
- **T06** Helm secret wiring for CNPG + app secret — depends on T02, T05
- **T07** CNPG manifests for `vridge-db` — no deps
- **T08** CI image build workflow — depends on T04
- **T09** CD deploy workflow — depends on T05, T06, T07, T08
- **T10** Deployment runbook + smoke checklist — depends on T07, T09

## Why this is right-sized

I intentionally did **not** make one giant “migrate vridge to k3s” task. That would combine:

- app config,
- app health behavior,
- Docker build,
- Helm templating,
- database manifests,
- and CI/CD changes

into one risky PR.

I also did **not** split too far down into tiny glue-only tasks like “add one env var” or “add one label,” because those would create noise without moving the system forward.

This is the smallest set of tasks that still gives us:

- early app-level tests,
- early chart validation,
- isolated infra changes,
- and a safe deployment path.

---

# Prompt 01 — Add an architecture and env contract document

```text
You are implementing Task T01.

Goal:
Add a short architecture/ADR-style document that captures the agreed migration target for the new app "vridge".

Context:
- Existing app "ssemtle" runs in k3s behind Traefik and already uses an existing CloudNativePG cluster directly.
- New app "vridge" is being migrated from Vercel into k3s.
- "vridge" must get a separate CloudNativePG cluster named "vridge-db".
- No shared tables, no shared database, no shared credentials with "ssemtle".
- Initial "vridge" DB access is direct to CNPG, without PgBouncer.
- Namespace should be "vridge" unless an existing repo convention strongly requires a suffix like "vridge-prod".
- DB envs should come from the CNPG generated secret "vridge-db-app".
- App-only secret values should live in a separate secret like "vridge-env".

Deliverables:
1. Add a document under docs/ or adr/ that explains:
   - current state,
   - target state,
   - namespace naming,
   - env contract,
   - explicit non-goals for phase 1.
2. Include one simple ASCII diagram for current state and one for target state.
3. Include a section called "Deferred" that explicitly says PgBouncer is not part of phase 1.

Testing:
- No code tests required.
- Ensure the doc is internally consistent with current repository naming.
- If the repo already has ADR conventions, follow them.

Done when:
- A new contributor can understand the migration target and env contract without reading chat history.
- The document is concise, accurate, and references exact names: vridge, vridge-db, vridge-db-app, vridge-env.
```

# Prompt 02 — Add runtime config validation for vridge

```text
You are implementing Task T02.

Goal:
Introduce a small, testable runtime configuration module for the vridge app so required env vars are validated explicitly and fail fast.

Context:
- Current known envs:
  DATABASE_URL
  DIRECT_URL
  BETTER_AUTH_SECRET
  BETTER_AUTH_URL
  NEXT_PUBLIC_APP_URL
- DATABASE_URL and DIRECT_URL will initially point to the same CNPG URI.
- BETTER_AUTH_SECRET and BETTER_AUTH_URL are runtime values.
- NEXT_PUBLIC_APP_URL is a public URL and may be used at build time as well.
- This task is only about config validation inside the app. Do not change Kubernetes or CI/CD here.

Requirements:
1. Add a config module with typed accessors.
2. Validate required env vars on startup.
3. Keep implementation minimal and aligned with the existing stack:
   - reuse an existing validation library if present,
   - otherwise add a tiny dependency only if justified,
   - or write a small internal validator.
4. Do not log secret values.

Testing:
1. Add tests that fail when a required env var is missing.
2. Add tests that pass with a complete minimal env set.
3. Add tests confirming secret values are not echoed in thrown errors if you can do so cleanly.

Done when:
- The app has a single obvious source of truth for required envs.
- Missing configuration fails early and predictably.
- The tests are fast and isolated.
```

# Prompt 03 — Add health endpoints suitable for Kubernetes probes

```text
You are implementing Task T03.

Goal:
Add lightweight /healthz and /readyz endpoints to the vridge app for Kubernetes liveness, readiness, and startup probes.

Context:
- The existing Helm pattern uses:
  /healthz for liveness/startup
  /readyz for readiness
- The app will run in Kubernetes with rolling updates.
- These endpoints should be cheap, deterministic, and should not introduce unnecessary DB pressure.

Requirements:
1. Implement /healthz returning 200 when the app process is alive.
2. Implement /readyz returning 200 when the app is ready to serve HTTP traffic.
3. Keep readiness logic lightweight:
   - do not require a live database query in phase 1 unless the app already has a strong built-in readiness mechanism.
4. Return simple machine-readable bodies if that fits the framework conventions.
5. Keep the implementation framework-native.

Testing:
1. Add endpoint tests verifying:
   - /healthz returns 200,
   - /readyz returns 200 in the normal app startup path.
2. Keep tests fast and isolated from external services.

Done when:
- These routes exist in production code.
- They are safe to use in Kubernetes probes.
- Tests cover the success path.
```

# Prompt 04 — Add production containerization for self-hosting vridge

```text
You are implementing Task T04.
Depends on: T02, T03

Goal:
Add a production-ready container build for vridge so it can run in k3s instead of Vercel.

Context:
- The target deployment model is self-hosted in k3s behind Traefik.
- The app should run as a standard production web container.
- NEXT_PUBLIC_APP_URL may need to be provided at build time.
- The existing ssemtle workflow builds and pushes a Docker image; vridge needs the same capability.

Requirements:
1. Add or improve:
   - Dockerfile
   - .dockerignore
   - production start command
2. Prefer a multi-stage build if the stack supports it cleanly.
3. Run as non-root in the final image if practical.
4. Make build-time handling of NEXT_PUBLIC_APP_URL explicit.
5. Do not bake secrets like DATABASE_URL or BETTER_AUTH_SECRET into the image.

Testing:
1. Add the smallest useful test/validation for the container path:
   - successful production build,
   - or a repo-standard smoke check proving the production server can start.
2. If the repo already has a CI test command, integrate with that rather than inventing a parallel system.

Done when:
- Another engineer can build and run the app locally in a production-like container.
- Build-time vs runtime env handling is explicit.
- No runtime secrets are required at image build time except public build args if truly needed.
```

# Prompt 05 — Create a vridge Helm chart scaffold with safe defaults

```text
You are implementing Task T05.

Goal:
Create or adapt a Helm chart for vridge with safe defaults and improved chart structure based on the lessons from the ssemtle chart review.

Context:
- We want a chart for a web app behind Traefik.
- Known best-practice improvements from earlier review:
  - do not hard-code namespace in values.yaml,
  - use .Release.Namespace instead,
  - honor service.type in the Service template,
  - use standard app.kubernetes.io labels,
  - support resource requests/limits,
  - include a PodDisruptionBudget,
  - keep securityContext and seccomp support,
  - make ingress configurable.
- Secret wiring for CNPG should be handled in a later task.

Requirements:
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

Testing:
1. Add chart validation using helm lint.
2. Add at least one rendered-template assertion path:
   - either helm template plus a small script,
   - or an existing chart test setup if the repo already has one.
3. Verify rendered output includes:
   - Service type,
   - ingress class,
   - consistent selector labels.

Done when:
- The chart renders cleanly with default values.
- The chart structure is safer than the original ssemtle version we reviewed.
- Namespace is controlled by Helm release namespace, not a custom values field.
```

# Prompt 06 — Wire vridge chart env vars from CNPG and app secrets

```text
You are implementing Task T06.
Depends on: T02, T05

Goal:
Teach the vridge Helm chart to consume database config from the CNPG-generated secret and app-only values from a separate secret.

Context:
- CNPG cluster name will be vridge-db.
- CNPG will generate an application secret named vridge-db-app.
- That secret will expose a key named uri for the app connection string.
- App-owned secret should be named vridge-env.
- Initial mapping:
  DATABASE_URL <- vridge-db-app:uri
  DIRECT_URL   <- vridge-db-app:uri
  BETTER_AUTH_SECRET <- vridge-env
  BETTER_AUTH_URL    <- vridge-env
- NEXT_PUBLIC_APP_URL is expected to be handled at build time, not injected as a runtime secret unless the app truly needs runtime access too.

Requirements:
1. Update the Deployment template to wire:
   - DATABASE_URL from vridge-db-app:uri
   - DIRECT_URL from vridge-db-app:uri
2. Keep app-owned runtime secret injection separate via envFrom or explicit env entries from vridge-env.
3. Make secret names configurable in values, but default to:
   - db secret: vridge-db-app
   - app secret: vridge-env
4. Do not duplicate DB credentials into the app secret.

Testing:
1. Add chart render tests/assertions that confirm:
   - DATABASE_URL points to secretKeyRef vridge-db-app / uri
   - DIRECT_URL points to secretKeyRef vridge-db-app / uri
   - vridge-env is included for app settings
2. Keep the chart renderable without real secret contents.

Done when:
- The chart expresses the intended secret boundary clearly.
- DB credentials are sourced only from the CNPG-managed secret.
- The app secret stays small and app-specific.
```

# Prompt 07 — Add namespace and CNPG manifests for vridge-db

```text
You are implementing Task T07.

Goal:
Add the Kubernetes manifests needed to create the vridge namespace and the dedicated CloudNativePG cluster for vridge.

Context:
- Namespace should default to vridge.
- CNPG cluster name should be vridge-db.
- Initial database name should be vridge.
- Initial owner should be vridge.
- Initial phase does not include PgBouncer.
- The purpose is to isolate vridge from ssemtle at the database cluster boundary.

Requirements:
1. Add manifests for:
   - Namespace vridge
   - CNPG Cluster vridge-db
2. Bootstrap the cluster with:
   - database: vridge
   - owner: vridge
3. Choose conservative initial storage and instance defaults suitable for a first rollout.
4. Keep naming aligned with the agreed env/secret contract.
5. Add comments or a short README explaining that CNPG will generate the application secret vridge-db-app.

Testing:
1. Add whatever repo-standard manifest validation is available.
2. If there is no existing manifest validation, add a lightweight static check or documented render/inspection script.
3. Avoid adding fake CRDs just to make validation pass.

Done when:
- The manifests are clean, readable, and consistent with the target architecture.
- A human reviewer can see how the future secret vridge-db-app will be produced.
- No PgBouncer resources are introduced in this task.
```

# Prompt 08 — Add CI image build workflow for vridge

```text
You are implementing Task T08.
Depends on: T04

Goal:
Add or update CI so vridge can build and publish a production image in a repeatable way.

Context:
- The existing ssemtle workflow uses GitHub Actions, Docker Buildx, and image push.
- For vridge we want a similarly simple path, but with a few safety improvements:
  - deterministic tagging,
  - build cache if practical,
  - explicit build-time public URL handling.
- This task is only the build workflow. Do not deploy in this task.

Requirements:
1. Add a workflow that:
   - checks out the repo,
   - builds the production image,
   - pushes it to the chosen registry,
   - tags at least with commit SHA.
2. Prefer adding image metadata and cache support if the repo setup makes that straightforward.
3. Make build-time NEXT_PUBLIC_APP_URL handling explicit.
4. Keep permissions minimal.

Testing:
1. Validate workflow syntax using the repo’s existing linting if available.
2. If actionlint is not present and easy to add, add it only if it fits the project naturally.
3. Ensure the workflow references the correct Dockerfile and context.

Done when:
- A push to the target branch can produce a deployable image.
- The workflow is focused on build/publish only.
- Build-time public config is explicit and documented.
```

# Prompt 09 — Add CD workflow for vridge deploy to k3s

```text
You are implementing Task T09.
Depends on: T05, T06, T07, T08

Goal:
Add or adapt the deployment workflow so vridge can be deployed to k3s safely through Helm.

Context:
- Deploy target is k3s.
- Kubeconfig should come from a user-readable path such as /home/ori/.kube/config, not from loosening permissions on /etc/rancher/k3s/k3s.yaml.
- We want safer deployment behavior than the original minimal workflow:
  - concurrency control,
  - environment scoping if available,
  - explicit helm lint/template validation,
  - helm upgrade --install with wait and rollback-oriented flags.

Requirements:
1. Add a deploy workflow that:
   - runs on the intended self-hosted runner label(s),
   - validates chart render before deploy,
   - deploys with helm upgrade --install,
   - uses explicit --kubeconfig or KUBECONFIG wiring,
   - targets the vridge namespace.
2. Add concurrency control to avoid overlapping production deploys.
3. Use Helm flags appropriate for safer rollouts.
4. Keep secrets out of logs.

Testing:
1. Ensure chart validation commands succeed in the workflow.
2. Validate workflow syntax if the repo already supports it.
3. Keep the workflow deploy-focused; do not rebuild the image here if the project already separates build and deploy.

Done when:
- The deployment path is deterministic and explicit.
- The kubeconfig usage is clear and does not rely on unsafe file permissions.
- A reviewer can see how chart validation happens before upgrade.
```

# Prompt 10 — Add deployment runbook and smoke validation checklist

```text
You are implementing Task T10.
Depends on: T07, T09

Goal:
Add an operator-facing runbook for deploying vridge into k3s with its dedicated CNPG cluster and validating the result safely.

Context:
- We want a human-readable path to bootstrap and verify the new stack.
- Important operational facts from earlier discussion:
  - use a user copy of kubeconfig rather than chmod 644 on /etc/rancher/k3s/k3s.yaml,
  - copied kubeconfig files do not auto-sync when the source changes,
  - vridge DB credentials come from vridge-db-app,
  - app-only settings live in vridge-env,
  - initial DB connection is direct to CNPG without PgBouncer.

Requirements:
1. Add a runbook that covers:
   - prerequisite kubeconfig setup,
   - namespace creation path,
   - CNPG cluster apply path,
   - app secret creation/update path,
   - image build/deploy path,
   - ingress/DNS/public URL configuration expectations,
   - smoke checks after deploy.
2. Include exact smoke checks for:
   - pods are ready,
   - ingress exists,
   - /healthz returns success,
   - /readyz returns success,
   - app can start with DB-backed configuration.
3. Include a short section on secret ownership:
   - vridge-db-app is generated by CNPG,
   - vridge-env is app-managed.
4. Include a short section on deferred work:
   - PgBouncer,
   - staging namespace,
   - advanced DB backup policy if not yet defined.

Testing:
- No code tests required.
- The commands in the runbook should be internally consistent with names chosen in previous tasks.

Done when:
- An operator can follow the runbook to deploy vridge safely.
- The runbook does not assume hidden tribal knowledge.
- The smoke checklist is explicit enough for manual verification after rollout.
```

## Suggested merge order

Use this order unless repo realities force a small adjustment:

1. T01
2. T02 and T03 in parallel
3. T04
4. T05
5. T06 and T07 in parallel
6. T08
7. T09
8. T10

## Deferred for later

These should stay out of the first migration milestone:

- Adding **PgBouncer**
- Multi-environment split like `vridge-staging` / `vridge-prod`
- External Postgres exposure
- Reworking the existing `ssemtle` database path
- Deep database backup/PITR policy changes for the existing stack

## Final note

These prompts are sized so an agent can take one task, write tests first where code exists, keep the diff reviewable, and merge without blocking unrelated work. If you want, I’ll turn the next step into an even more operational backlog with labels like `app`, `infra`, `ci`, `docs`, and `safe-to-parallelize`.
