---
name: scribe
description: Post-merge doc sync — updates task status and progress tracking via PR to dev
argument-hint: '<task-number> (e.g., 01, 02, ...10)'
allowed-tools: Bash(git *), Bash(gh *), Read, Glob, Grep, Write, Edit
---

Run post-merge documentation sync for task T$ARGUMENTS.

1. **Ensure we start from latest dev**:

   ```bash
   git fetch origin dev
   git checkout dev
   git merge --ff-only origin/dev
   ```

   If ff-only fails, **stop immediately** and report the error.

2. **Create a docs branch**:

   ```bash
   git checkout -b docs/scribe-T$ARGUMENTS
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

8. **Push branch and open PR**:

   ```bash
   git push -u origin docs/scribe-T$ARGUMENTS
   gh pr create --base dev --title "docs: T$ARGUMENTS 결과 반영" --body "T$ARGUMENTS 태스크 완료에 따른 문서 동기화"
   ```

9. **Report** — print the PR URL and what was updated.
