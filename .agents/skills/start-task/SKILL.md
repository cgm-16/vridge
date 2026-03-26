---
name: start-task
description: Start work from `.claude/tasks/TNN-*.md` by checking dependencies, syncing `dev`, preferring a `git worktree`, surfacing the linked issue, and summarizing the exact implementation scope.
---

# Start Task

Use this skill when Ori wants to begin one of the migration tasks tracked in `.claude/tasks/`.

## Workflow

1. Resolve the task file.

   ```bash
   ls .claude/tasks/T$ARGUMENTS-*.md
   ```

2. Read the task file and extract:
   - `task`
   - `title`
   - `branch`
   - `depends_on`
   - `issue`
   - `agent`
   - `status`

3. Stop if the task is already complete or otherwise not ready to start.
   - If `status: done`, report that the task is already marked complete.
   - If the task file is missing required frontmatter, stop and report the missing field.

4. Check dependencies against `dev`.
   - For each dependency in `depends_on`, verify a merged PR exists on `dev`.

   ```bash
   gh pr list --state merged --base dev --search "T${dep}" --limit 1
   ```

   - If any dependency is not merged, stop and report the blocking task.
   - In sandboxed sessions, treat `gh` failures as permission blockers and stop for Ori.

5. Ensure issue tracking is in place before implementation.
   - If `issue` is present, show it:

   ```bash
   gh issue view {issue number}
   ```

   - If `issue` is missing, stop and create a feature issue from `.github/ISSUE_TEMPLATE/feature_request.md` before implementing.

6. Sync the base branch using the repo rule set.

   ```bash
   git fetch origin dev
   git checkout dev
   git pull --ff-only origin dev
   ```

   - If the fast-forward pull fails, stop and ask Ori.

7. Prefer a worktree-based task checkout.
   - Use the task branch from frontmatter.
   - Use a deterministic local path so the worktree is easy to locate.

   ```bash
   git worktree add "../vridge-T$ARGUMENTS" -b "{branch}" dev
   ```

   - If the branch already exists locally, attach the worktree without recreating the branch.
   - Only fall back to a normal branch checkout if worktree setup is genuinely blocked and that exception is explicit in the session.

8. Summarize the task before implementation starts.
   - Print the task title.
   - Summarize goal, requirements, testing expectations, and done criteria.
   - If `agent` is present, print the recommended Codex handoff doc:
     - `app-developer` -> `docs/agents/app-developer.md`
     - `infra-engineer` -> `docs/agents/infra-engineer.md`
     - `scribe` -> `docs/agents/scribe.md`

## Output Contract

The final response should leave the implementing session with:

- the resolved task file path
- dependency status
- issue status
- the branch or worktree that was prepared
- a concise implementation brief
- the recommended agent doc, if one exists
