---
name: finish-task
description: Finish a migration task — runs checks, pushes branch, creates PR with labels/milestone
argument-hint: '<task-number> (e.g., 01, 02, ...10)'
allowed-tools: Bash(git *), Bash(gh *), Bash(pnpm *), Read, Glob
---

Wrap up migration task T$ARGUMENTS.

1. **Find the task file**:

   ```
   ls .claude/tasks/T$ARGUMENTS-*.md
   ```

   Read it and extract: `title`, `branch`, `labels`, `milestone`, `issue`.

2. **Verify tests and types pass**:

   ```
   pnpm test && pnpm exec tsc --noEmit
   ```

   If either fails, **stop** and report the errors. Do not proceed.

3. **Stage and commit** any remaining changes (only if there are staged/unstaged changes):

   ```bash
   git add -A
   if ! git diff --cached --quiet; then
     git commit -m "feat: T$ARGUMENTS 구현 완료"
   else
     echo "No changes to commit"
   fi
   ```

4. **Push the branch**:

   ```
   git push -u origin HEAD
   ```

5. **Create PR** targeting `dev`:

   ```bash
   gh pr create --base dev \
     --title "[T$ARGUMENTS] {title from frontmatter}" \
     --label "{labels, comma-separated}" \
     --milestone "{milestone from frontmatter}" \
     --body "$(cat <<'EOF'
   ## 작업 내용

   {summary of what was implemented — read from recent commits}

   ## 테스트

   - pnpm test 통과
   - tsc --noEmit 통과

   {if issue number exists: Closes #{issue}}
   EOF
   )"
   ```

6. **Report** — print the PR URL.

**Important**: Do NOT update tracking docs or task file status. The `/scribe` skill handles that after merge.
