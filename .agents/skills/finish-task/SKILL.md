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
   - `labels`
   - `milestone`
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
   git status --short
   git log --oneline origin/dev..HEAD
   ```

   - If there are no working tree changes and no task commits ahead of `dev`, report that there is nothing to finish.

6. Stage and commit the task changes.

   ```bash
   git add -A
   ```

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
     - linked issue reference for context

9. Report the result.
   - Print the PR URL.
   - Include the commit created, or say that no commit was needed.

## Guardrails

- Do not update tracking docs or task status as part of `finish-task`.
- Do not bypass failing tests or type checks.
- Do not commit unrelated changes.
