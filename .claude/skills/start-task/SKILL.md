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

   ```
   gh pr list --state merged --search "T{dep}" --limit 1
   ```

   If any dependency PR is not yet merged to dev, **stop** and report:

   > Blocked: T{dep} has not been merged yet. Merge it first, then retry.

3. **Switch to dev and pull latest**:

   ```
   git checkout dev && git pull origin dev
   ```

4. **Create the feature branch**:

   ```
   git checkout -b {branch from frontmatter}
   ```

5. **Show linked issue** (if `issue` is set):

   ```
   gh issue view {issue number}
   ```

6. **Summarize** — print the task title, goal, requirements, and done criteria from the task file so the implementing session starts with full context.

7. **Recommend agent** — if the task file specifies an `agent` field, print:
   > Recommended agent for this task: {agent}
