# Resolve

End-to-end workflow to resolve a gitScrum task: fetch → fix → verify → ship.

## Usage

```
/fix-resolve <uuid>
```

## Constants

- **company_slug**: `triptyk`
- **project_slug**: `<slug>`

## Required tools

- `mcp__gitscrum__task` (detail + update)
- `mcp__gitscrum__comment` (add)
- `mcp__gitscrum__project` (workflows)
- `gh` CLI

---

### 1. Fetch and understand

Fetch the task via `mcp__gitscrum__task` (detail with comments & files).

Read title and description. If the description is empty, vague, or you have low confidence in the root cause, ask **one** focused clarifying question. Otherwise, state your understanding in one sentence and proceed.

If context is missing from the ticket, search before asking: `git log --oneline --all | grep -i <keyword>` or grep the codebase.

### 2. Branch

```bash
git checkout develop
git pull origin develop
git checkout -b fix/<short-slug>   # kebab-case, max 4 words, derived from task title
```

If `git pull` produces conflicts or fails: stop and report. Do not improvise.

### 3. Plan, then implement

Before editing any file, output a plan containing:
- Files to change
- Specific edits per file
- Why this is the minimal correct fix

Wait for approval, then implement.

Standards:

- Minimal correct change — no opportunistic refactoring
- Follow CLAUDE.md critical rules

### 4. Verify

Propose a test strategy based on the change:
- Logic/behavior change → run unit + integration tests
- Pure copy/config/typo → build only
- State your proposal and run it unless the user objects

```bash
pnpm test:unit    # unit
pnpm test         # integration
pnpm build        # type check
```

If anything fails: fix it. If you can't fix it after 2 attempts, stop and report — do not push broken code.

Review `git diff` and confirm the change matches the plan.

### 5. Confirm, commit, push, PR

Show a summary: files modified, what changed, why. Then ask:

> "Ready to commit, push, and open the PR?"

On approval:

```bash
git add <relevant files>   # never git add -A
git commit -m "fix: <concise English description>" --no-verify
git push -u origin <branch-name>

gh pr create \
  --base develop \
  --title "fix: <same as commit>" \
  --body "$(cat <<'EOF'
## Summary
- <what was broken>
- <root cause>
- <what was changed>

## Test plan
- [ ] Tests pass
- [ ] Manual verification: <what to check>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If `gh pr create` fails: report the error, leave the branch pushed, stop.

### 6. Resolve and close

Post a comment on the task via `mcp__gitscrum__comment` (action: add). Write in French, no markdown, use line breaks between sections:

- **Problème rapporté**: user-facing symptom, one sentence
- **Cause racine**: technical root cause — code path, null/missing value, wrong assumption
- **Correction**: what changed and why it fixes the issue — file names, function names, logic change
- **PR**: GitHub PR URL

Then move the task to Done:
1. Fetch columns via `mcp__gitscrum__project` (action: workflows)
2. Pick a sprint-specific done column matching the current sprint (e.g. "DONE -> 24 AVRIL") if one exists; otherwise the generic "Done"
3. Update via `mcp__gitscrum__task` (action: update) with `workflow_id`

Report the PR URL and the column name used.

---

## Failure handling

At any step, if a command fails unexpectedly: stop, report the error verbatim, and wait for instructions. Do not retry destructive operations or improvise around tool failures.
