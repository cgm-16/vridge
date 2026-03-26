---
name: start-task
description: Start a migration task — checks deps, creates branch, summarizes scope
argument-hint: '<task-number> (e.g., 01, 02, ...10)'
allowed-tools: Bash(git *), Bash(gh *), Read, Glob
---

Start work on migration task T$ARGUMENTS.

1. **Find the task file**:

   ```
   ls .claude/tasks/T$ARGUMENTS-*.md
   ```

   Read it and extract the frontmatter fields: `branch`, `depends_on`, `issue`, `agent`.

2. **Check dependencies** — for each task in `depends_on`:

   ```bash
   gh pr list --state merged --base dev --search "T${dep}" --limit 1
   ```

   If any dependency PR is not yet merged to dev, **stop** and report:

   > Blocked: T${dep} has not been merged yet. Merge it first, then retry.

3. **Update dev**:

   ```
   git fetch origin dev && git merge --ff-only origin/dev
   ```

   If not currently on dev, run this from the main worktree (do not checkout).

4. **Create the feature branch on a new worktree**:

   ```
   git worktree add ../{branch from frontmatter} -b {branch from frontmatter} dev
   ```

   The worktree will be created as a sibling directory of the repo root. After creation, tell the user the worktree path and remind them to open it in the IDE if needed.

5. **Show linked issue** (if `issue` is set):

   ```
   gh issue view {issue number}
   ```

6. **Summarize** — print the task title, goal, requirements, and done criteria from the task file so the implementing session starts with full context.

7. **Recommend agent** — if the task file specifies an `agent` field, print:
   > Recommended agent for this task: {agent}
