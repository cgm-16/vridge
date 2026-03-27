---
name: address-review
description: Extract CodeRabbit's consolidated AI prompt from the latest PR review and fix all findings. Loops each round until APPROVED. Pass --background to run autonomously in a background agent (up to 5 rounds).
argument-hint: '[--background]'
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, Agent
---

# address-review

Fix all outstanding CodeRabbit review findings on the current PR.

## Setup (run once)

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
PR=$(gh pr view --json number --jq .number)
```

## Shared helpers

**Fetch latest CodeRabbit review** (returns JSON with `id`, `state`, `body`):

```bash
gh api /repos/$REPO/pulls/$PR/reviews \
  --jq '[.[] | select(.user.login | contains("coderabbitai"))] | last | {id: .id, state: .state, body: .body}'
```

**Extract the AI prompt block** from a review body (pipe body text into this):

```bash
python3 -c "
import sys, re
body = sys.stdin.read()
m = re.search(r'Prompt for all review comments.*?\x60\x60\x60\w*\r?\n(.*?)\x60\x60\x60', body, re.DOTALL)
print(m.group(1).strip() if m else '')
"
```

**Reply to all inline comments from a review** after committing:

```bash
SHA=$(git rev-parse --short HEAD)
REVIEW_ID=<id from fetch step>
for ID in $(gh api /repos/$REPO/pulls/$PR/reviews/$REVIEW_ID/comments --jq '.[].id'); do
  gh api /repos/$REPO/pulls/comments/$ID/replies -X POST \
    -f body="Applied in ${SHA}."
done
```

**Poll for a new CodeRabbit review** (call after push; pass previous review ID):

```bash
PREV_ID=<id before push>
TIMEOUT=0
for i in $(seq 1 6); do
  sleep 30
  RESULT=$(gh api /repos/$REPO/pulls/$PR/reviews \
    --jq '[.[] | select(.user.login | contains("coderabbitai"))] | last | {id: .id, state: .state}')
  NEW_ID=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['id'] if d else '')")
  NEW_STATE=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['state'] if d else '')")
  [ "$NEW_ID" != "$PREV_ID" ] && break
done
[ "$NEW_ID" = "$PREV_ID" ] && TIMEOUT=1
# NEW_STATE and NEW_ID hold the latest review; TIMEOUT=1 if no new review arrived
```

---

## If `--background` is in $ARGUMENTS

Resolve REPO and PR using the setup commands above, then spawn a `general-purpose` agent
with `run_in_background: true` using the following prompt (substitute real values for
`{REPO}` and `{PR}`):

---

Run an autonomous CodeRabbit review-fix loop on PR #{PR} in repo {REPO}. Repeat up to 5 rounds:

**Each round:**

1. Fetch the latest CodeRabbit review:
   `gh api /repos/{REPO}/pulls/{PR}/reviews --jq '[.[] | select(.user.login | contains("coderabbitai"))] | last | {id: .id, state: .state, body: .body}'`
   Save `id` as REVIEW_ID and `state` as STATE.

2. If STATE is `APPROVED`: stop. Report "CodeRabbit approved after N round(s). ✓"

3. Extract the AI prompt block from the review body:

   ```python
   python3 -c "
   import sys, re
   body = sys.stdin.read()
   m = re.search(r'Prompt for all review comments.*?\x60\x60\x60\w*\r?\n(.*?)\x60\x60\x60', body, re.DOTALL)
   print(m.group(1).strip() if m else '')
   "
   ```

   If empty: stop. Report "No actionable prompt found in latest review."

4. Follow the extracted prompt exactly — verify each finding against the current code,
   fix only what is needed. Use `test-runner` subagent for `pnpm test` and
   `lint-typecheck` subagent for `pnpm exec tsc --noEmit`. If either fails, stop and
   report the errors with full detail.

5. `git add -A && git commit -m "fix: address CodeRabbit review findings (round N)"` then `git push`.

6. Reply to every inline comment from this review:

   ```bash
   SHA=$(git rev-parse --short HEAD)
   for ID in $(gh api /repos/{REPO}/pulls/{PR}/reviews/$REVIEW_ID/comments --jq '.[].id'); do
     gh api /repos/{REPO}/pulls/comments/$ID/replies -X POST -f body="Applied in ${SHA}."
   done
   ```

7. Poll for a new CodeRabbit review (every 30s, up to 3 minutes):

   ```bash
   TIMEOUT=0
   for i in $(seq 1 6); do
     sleep 30
     RESULT=$(gh api /repos/{REPO}/pulls/{PR}/reviews \
       --jq '[.[] | select(.user.login | contains("coderabbitai"))] | last | {id:.id,state:.state}')
     NEW_ID=$(echo "$RESULT" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['id'] if d else '')")
     NEW_STATE=$(echo "$RESULT" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['state'] if d else '')")
     [ "$NEW_ID" != "$REVIEW_ID" ] && break
   done
   [ "$NEW_ID" = "$REVIEW_ID" ] && TIMEOUT=1
   ```

   If TIMEOUT=1: stop. Report "No new review after 3 minutes."

8. Update REVIEW_ID and STATE from the new review and continue to next round.

**Final report format:**

```text
Round 1: N findings → abc1234
Round 2: M findings → def5678
Round 3: CodeRabbit APPROVED ✓
```

Or if max rounds hit:

```text
Stopped after 5 rounds — not yet approved.
Remaining findings: [one-line summary of last prompt]
Last commit: {sha}
```

---

After spawning the agent, report to the user:
> Background agent launched for PR #$PR. You'll be notified when it completes.

---

## Default (foreground) mode

Run the loop inline. The coordinator does the fix work each round.

Initialize `ROUND=0` before starting.

**Round start:**
1. Increment ROUND. If ROUND > 5: stop — "Maximum 5 rounds reached — stop."
2. Fetch the latest CodeRabbit review. Save REVIEW_ID, STATE, and body.
3. If STATE is `APPROVED`: stop — "CodeRabbit has already approved this PR."
4. Extract the AI prompt block. If empty: stop — "No actionable prompt found in the latest review."
5. Print the round header and the full extracted prompt so the coordinator can read it.

**Fix:**
6. Follow the extracted prompt exactly — verify each finding against current code, fix only
   what is needed. Delegate tests to `test-runner` and type checking to `lint-typecheck`.
   Stop and report if either fails.
7. `git add -A && git commit -m "fix: address CodeRabbit review findings (round $ROUND)"` then `git push`.

**Reply:**
8. Reply to every inline comment from REVIEW_ID using the reply helper above.

**Poll:**
9. Poll for a new review using the poll helper above (PREV_ID = REVIEW_ID).
10. If TIMEOUT=1: stop — "No new review after 3 minutes. Run `/address-review` again once CodeRabbit responds."
11. If new STATE is `APPROVED`: stop — "CodeRabbit approved after $ROUND round(s). ✓"
12. If new STATE is `CHANGES_REQUESTED` and ROUND < 5: print the new findings and ask
    **"Continue with Round $((ROUND+1))? [Y/n]"** — loop back to Round start if confirmed, otherwise stop.
13. If new STATE is `CHANGES_REQUESTED` and ROUND = 5: stop — "Maximum 5 rounds reached — stop."
