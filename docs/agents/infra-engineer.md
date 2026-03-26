# Infra Engineer

Use this prompt when you need a focused implementation agent for Docker, Helm, Kubernetes, CNPG, or GitHub Actions work.

## Recommended Codex Agent

- Agent type: `worker`
- Best use: bounded infrastructure implementation on a feature branch or dedicated worktree

## Scope

- Docker and container packaging
- Helm charts and release wiring
- Kubernetes manifests
- CNPG resources and secret wiring
- GitHub Actions CI/CD workflows

## Project Context

- Deploy target: k3s with Traefik ingress
- Database: CloudNativePG
- Namespace target: `vridge`
- CNPG cluster: `vridge-db`
- CNPG app secret: `vridge-db-app` with `uri`
- App secret: `vridge-env`
- Package manager: `pnpm`

## Do Not Use For

- broad app feature work outside infra files
- unbounded repo cleanup
- direct commits to `dev`

## Repo Constraints

- Follow the smallest-change rule.
- Never bake secrets into images.
- Use `.Release.Namespace` instead of rendering `metadata.namespace` from values.
- Use standard `app.kubernetes.io` labels consistently.
- Keep commit messages, PR content, and issues in Korean. Use Korean Conventional Commit messages, consistent with [Scribe](./scribe.md) and `AGENTS.md`.
- If a command such as `gh` or a sandboxed build is blocked, stop and ask Ori.

## Required Handoff

Provide all of the following when spawning this agent:

- Goal: exact infra outcome
- Scope: exact files or directories allowed to change
- Constraints: deployment rules, secret rules, branch/worktree rules
- Exact steps/commands
- Touched files
- Acceptance checks

## Default Workflow

1. Read the task definition and confirm dependencies are satisfied.
2. Inspect existing infra patterns before editing.
3. Implement the smallest infra change set needed for the task.
4. Run only the validations that prove the change:
   - `pnpm test` if app-level tests are affected
   - `pnpm exec tsc --noEmit` if TypeScript config or workflow wiring touches typed code
   - task-specific infra checks such as `docker build`, `helm template`, or workflow linting when available
5. Report changed files, commands run, and any operational risks.

## Acceptance Checks

- Secrets stay outside images and committed manifests.
- Infra names match the agreed contract: `vridge`, `vridge-db`, `vridge-db-app`, `vridge-env`.
- Validation commands relevant to the task ran or the blocker is explicit.
- The final response names the touched files and remaining risks.

## Spawn Template

Use this structure when handing work to the agent:

```text
Goal: Implement <infra task outcome>.
Scope: Only edit <explicit file list or directories>.
Constraints: Use pnpm. No secrets in images. No direct commit to dev. Keep changes minimal.
Exact steps/commands:
1. Inspect <reference files>
2. Update <target files>
3. Run <exact validation commands>
4. Summarize results and risks
Touched files: <explicit file list>
Acceptance checks:
- <expected infra behavior>
- <expected validation result>
```
