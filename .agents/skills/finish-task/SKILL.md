---
name: finish-task
description: Finish work from `.claude/tasks/TNN-*.md` by running validation, creating a Korean Conventional Commit, pushing the task branch, and opening a PR to `dev`.
---

# Finish Task

Use this skill when Ori wants to wrap up a migration task that is already implemented on a feature branch or task worktree.

## Workflow

1. Resolve the task file.

   ```bash
   ls .claude/tasks/T$ARGUMENTS-*.md
   ```

2. Read the task file and extract:
   - `task`
   - `title`
   - `branch`
   - `issue`

3. Confirm the current branch matches the task branch before mutating git state.

   ```bash
   git branch --show-current
   ```

   - If the current branch does not match the task branch, stop and report the mismatch.

4. Run required validation before staging or pushing.

   ```bash
   pnpm test
   pnpm exec tsc --noEmit
   ```

   - Stop on any failure and report the failing command output.
   - In sandboxed sessions, treat `gh` failures as permission blockers and stop for Ori.

5. Review the working tree and branch history.

   ```bash
   git status --porcelain
   git rev-list --count origin/dev..HEAD
   ```

   - Treat a non-empty `git status --porcelain` result as pending working tree changes.
   - Treat the `git rev-list --count` result as the number of task commits already ahead of `dev`.
   - If there are no working tree changes and the ahead count is `0`, report that there is nothing to finish.
   - If there are no working tree changes and the ahead count is greater than `0`, skip staging and commit creation and report that there is nothing new to commit because the branch is already ahead of `dev`.

6. Stage and commit the task changes only when working tree changes exist.

   ```bash
   git add -A
   ```

   - Do not run `git add -A` or create a commit when `git status --porcelain` is empty.
   - Use a Korean Conventional Commit message.
   - Commit type rule:
     - `docs`: docs-only task changes
     - `chore`: workflow-only maintenance
     - otherwise `feat`
   - Preferred message pattern:

   ```text
   {type}(task): T$ARGUMENTS 작업 마무리
   ```

7. Push the task branch.

   ```bash
   git push -u origin HEAD
   ```

8. Open a PR to `dev`.
   - Use `.github/pull_request_template.md` if the GitHub CLI does not apply it automatically.
   - Keep the linked issue open during review; do not close it in the PR body.
   - Use the task title for the PR title.
   - Include:
     - implementation summary
     - validation commands that passed
     - linked issue reference for context when `issue` is present

9. Report the result.
   - Print the PR URL.
   - Include the commit created, or say that no commit was needed because the branch was already ahead of `dev`.

## Guardrails

- Do not update tracking docs or task status as part of `finish-task`.
- Do not bypass failing tests or type checks.
- Do not commit unrelated changes.
