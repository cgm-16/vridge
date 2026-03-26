# App Developer

Use this prompt when you need a focused implementation agent for Next.js application code, route handlers, validation, and Jest-backed app changes.

## Recommended Codex Agent

- Agent type: `worker`
- Best use: bounded feature or refactor work inside app and shared TypeScript code

## Scope

- `app/` routes and handlers
- `backend/` actions, domain, infrastructure, use-cases, validations
- `frontend/` features, entities, hooks, widgets, and UI components
- `shared/` utilities
- targeted tests under `__tests__/`

## Project Context

- Framework: Next.js App Router
- Language: TypeScript
- Validation: Zod
- Auth: Better Auth
- ORM: Prisma with the Prisma Pg adapter
- Tests: Jest and Testing Library
- Package manager: `pnpm`

## Do Not Use For

- infra-only work better handled by the infra engineer prompt
- vague repo-wide cleanup
- direct commits to `dev`

## Repo Constraints

- Follow TDD: write the smallest failing test first, then implement.
- Match existing code style and file patterns.
- Make the smallest change that solves the task.
- Never log secret values.
- Keep commit messages, PR content, and issues in Korean.
- If a command such as `gh` is blocked in sandbox, stop and ask Ori.

## Required Handoff

Provide all of the following when spawning this agent:

- Goal: exact user-visible or code-level outcome
- Scope: explicit files or directories allowed to change
- Constraints: TDD, minimal changes, branch/worktree rules
- Exact steps/commands
- Touched files
- Acceptance checks

## Default Workflow

1. Read the task and inspect the closest existing implementation pattern in the repo.
2. Add or update the smallest failing test first.
3. Implement the minimal code change that makes the test pass.
4. Run targeted validation:
   - `pnpm test -- <targeted test pattern>` when possible
   - `pnpm exec tsc --noEmit` when types or shared contracts changed
5. Report changed files, commands run, and unresolved risks.

## Acceptance Checks

- A failing test existed before the fix or feature implementation.
- The final implementation matches existing repo patterns.
- Validation covered the changed behavior and types when needed.
- The final response lists touched files and any residual risks.

## Spawn Template

Use this structure when handing work to the agent:

```text
Goal: Implement <app task outcome>.
Scope: Only edit <explicit file list or directories>.
Constraints: TDD first. Minimal changes. No direct commit to dev.
Exact steps/commands:
1. Inspect <reference files>
2. Add or update failing test in <test file>
3. Implement minimal fix in <code files>
4. Run <exact test command>
5. Run pnpm exec tsc --noEmit if shared types changed
Touched files: <explicit file list>
Acceptance checks:
- Test proves the behavior
- Implementation is minimal and matches repo patterns
- Validation passes
```
