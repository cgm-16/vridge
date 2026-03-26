---
name: scribe
description: Post-merge doc sync — updates task status and progress tracking on dev
argument-hint: '<task-number> (e.g., 01, 02, ...10)'
allowed-tools: Bash(git *), Read, Glob, Grep, Write, Edit
---

Run post-merge documentation sync for task T$ARGUMENTS.

1. **Verify we are on dev**:

   ```
   git branch --show-current
   ```

   If the current branch is not `dev`, **stop immediately**:

   > Error: Scribe must run on dev branch. Current branch: {branch}. Switch to dev first.

2. **Pull latest dev**:

   ```
   git pull origin dev
   ```

3. **Find the task file**:

   ```
   ls .claude/tasks/T$ARGUMENTS-*.md
   ```

   Read it and extract frontmatter.

4. **Update task status** — edit the task file frontmatter:

   Change `status: todo` → `status: done`

5. **Find the merged PR** for this task:

   ```bash
   gh pr list --state merged --base dev --head {branch from frontmatter} --json number,title,url
   ```

   Extract the PR number and URL.

6. **Update issue field** in task frontmatter if not already set.

7. **Commit all documentation changes**:

   ```bash
   git add {resolved task file path}
   git commit -m "docs: T$ARGUMENTS 결과 반영"
   ```

8. **Push to dev**:

   ```
   git push origin dev
   ```

9. **Report** — print what was updated.
