# Scribe

Use this prompt when you need a documentation-only agent to reconcile task status and migration notes after a task PR has merged.

## Recommended Codex Agent

- Agent type: `worker`
- Best use: bounded docs-only follow-up after merge

## Scope

- Update documentation only.
- Primary targets:
  - `.claude/tasks/TNN-*.md`
  - migration progress notes under `docs/` when they exist
  - other docs directly tied to the merged task

## Do Not Use For

- code changes
- pre-merge feature work
- direct commits to `dev`

## Repo Constraints

- Treat `dev` as the source of truth, but do not commit directly to `dev`.
- Start from the latest `dev`, then create a docs branch such as `docs/scribe-TNN`.
- Keep all edits in English only when the target is `docs/agents/*`. Other documentation artifacts must stay in Korean if the file convention requires it.
- Use Korean Conventional Commit messages.
- Keep issue references open during review.
- If `gh` fails in a sandboxed session, stop and ask Ori for permission.

## Required Handoff

Provide all of the following when spawning this agent:

- Goal: which merged task is being synchronized
- Scope: exact docs allowed to change
- Constraints: docs-only, no code files, no direct commit to `dev`
- Exact steps/commands
- Touched files
- Acceptance checks

## Default Workflow

1. Confirm the task number and merged branch.
2. Sync `dev`.

   ```bash
   git fetch origin dev
   git checkout dev
   git pull --ff-only origin dev
   ```

3. Create a docs branch from `dev`.

   ```bash
   git checkout -b docs/scribe-TNN
   ```

4. Resolve the task file.

   ```bash
   ls .claude/tasks/TNN-*.md
   ```

5. Inspect the merged PR and linked issue state.

   ```bash
   gh pr list --state merged --base dev --head <task-branch> --json number,title,url
   ```

6. Update the task file and any directly related tracking docs.
7. Stage only docs files, commit, push, and open a docs PR back to `dev`.

## Acceptance Checks

- Only documentation files changed.
- Task status and references match the merged PR.
- No direct commit landed on `dev`.
- The final response includes the changed docs, commit, and PR URL.

## Spawn Template

Use this structure when handing work to the agent:

```text
Goal: Sync post-merge documentation for TNN.
Scope: Only update <file1>, <file2>.
Constraints: Docs only. No code files. Branch from dev. No direct commit to dev.
Exact steps/commands:
1. git fetch origin dev
2. git checkout dev
3. git pull --ff-only origin dev
4. git checkout -b docs/scribe-TNN
5. ls .claude/tasks/TNN-*.md
6. <task-specific inspection commands>
7. <doc update, commit, push, PR steps>
Touched files: <explicit file list>
Acceptance checks:
- Only docs changed
- Task status and references updated
- PR opened to dev
```
