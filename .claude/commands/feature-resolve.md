# Feature

End-to-end workflow to build a gitScrum feature task: spec → plan → build → verify → ship → document.

Features differ from fixes: there is no broken state to anchor on, and the cost of building the wrong thing is high. This command front-loads understanding before any code is written, and captures what was actually built afterward.

## Usage

```
/feature-resolve <uuid>
```

## Constants

- **company_slug**: `triptyk`
- **project_slug**: `ember-boilerplate`

## Required tools

- `mcp__gitscrum__task` (detail + update)
- `mcp__gitscrum__comment` (add)
- `mcp__gitscrum__project` (workflows)
- `gh` CLI

## Artifacts produced

Depending on complexity (set in step 1):

- **Light** — PR description only
- **Medium** — `docs/features/<slug>/domain.md` (before implementation)
- **Deep** — `docs/features/<slug>/domain.md` (before) + `docs/features/<slug>/technical.md` (after)

---

### 1. Fetch and assess complexity

Fetch the task via `mcp__gitscrum__task` (detail with comments & files).

Read the title, description, and any attached files. Then classify the task on this axis (state your classification explicitly to the user):

- **Light** — CRUD on existing entity, copy change, isolated UI tweak, well-trodden pattern in the codebase
- **Medium** — new endpoint with non-trivial logic, new screen, integration with one existing subsystem
- **Deep** — new domain concept, new external integration, anything touching auth/permissions, anything with a data migration, anything ambiguous about what "done" means

The classification determines the question budget in step 2 **and** which specs get written. **Err toward Deep** when uncertain — the cost of one extra round of questions and one extra doc is much lower than the cost of a wrong-direction PR.

### 2. Challenge the spec

Before any planning, interrogate the spec across these axes. Skip an axis only if the ticket already answers it unambiguously — and say so explicitly ("Acceptance criteria are clear from the ticket: …").

- **Acceptance criteria / definition of done** — what does success look like? What's the observable behavior that proves it works?
- **Edge cases & error states** — empty inputs, missing relations, concurrent updates, network failures, validation failures. What should the user see? What should be logged?
- **Data model & migration impact** — new tables/columns? Nullable on existing rows? Backfill strategy? Any data the new feature depends on that doesn't exist yet?
- **API contract / breaking changes** — new endpoints, changed response shapes, deprecations. Is anything consumed by another app/client that would break?
- **Auth & permissions** — who can do this? Which role/scope/policy? Does it need a new permission, or does it fit an existing one?

Question budget by complexity:

- **Light**: up to 2 questions, only on axes the ticket genuinely leaves open
- **Medium**: 3–5 questions covering the axes that matter for this change
- **Deep**: as many as needed across all relevant axes, grouped logically

Ask all questions for a given round in **one message**, numbered, so the user can answer in one pass. Do not drip-feed.

After answers come back: restate your understanding in 3–5 bullets and ask "Have I got this right?" If new questions emerged from the answers, ask another round.

### 2b. Write the domain spec (Medium and Deep only)

Once the user has confirmed your restated understanding, write the domain spec to `docs/features/<slug>/domain.md`. The slug matches the branch name from step 3.

Structure:

```markdown
# <Feature name>

## Purpose
<1–2 sentences: what this feature does and why it exists>

## User stories
- As a <role>, I want <capability>, so that <outcome>

## Acceptance criteria
- <observable behavior 1>
- <observable behavior 2>

## Business rules & invariants
- <rule 1>
- <rule 2>

## Edge cases & error states
- <case>: <expected behavior>

## Out of scope
- <what is explicitly NOT being built>

## Technical approach (Deep only — 3–5 bullets)
- <layers touched>
- <integration points>
- <non-obvious choices>
```

No implementation details beyond the optional Technical approach section. This file is the contract — it should remain meaningful even if the implementation is rewritten later.

Show the file to the user and ask:

> "Domain spec written to `docs/features/<slug>/domain.md`. Approve to proceed, or flag changes."

Do not proceed to step 3 until the user approves. The domain spec is committed alongside the feature code in step 6.

### 3. Branch

Only after spec is locked (and domain spec written, for Medium/Deep).

```bash
git checkout develop
git pull origin develop
git checkout -b feat/<short-slug>   # kebab-case, max 4 words, derived from feature name
```

If `git pull` produces conflicts or fails: stop and report. Do not improvise.

### 4. Plan, then implement

Output a written plan **in chat** (not as a file — this is a working document, not an artifact):

- **Files to create or modify** — grouped by layer (data, service, controller, UI, tests)
- **Data model changes** — migrations, new fields, indexes
- **API surface** — new endpoints with request/response shape
- **Key logic** — the non-obvious parts in pseudocode or prose
- **Out of scope** — restate from the domain spec, plus anything else discovered during planning
- **Risks & open questions** — anything you're unsure about

Wait for explicit approval. Do not start editing until the user says "go" (or equivalent).

Standards while implementing:

- Follow CLAUDE.md critical rules
- Match existing patterns in the codebase before inventing new ones — grep for similar features and read them first

**Scope discipline (strict):** if you encounter something that needs changing but is not in the approved plan — a bug in adjacent code, a refactor that would help, a missing edge case the spec didn't cover — **stop and ask** before touching it. Do not silently expand scope. Two valid responses from the user: "yes, add it" (update the plan, and the domain spec if behavior is affected) or "no, file a follow-up" (note it for the PR description and leave it alone).

### 5. Verify

Tests are expected for features unless the user explicitly waives them. Propose a test strategy:

- New service/business logic → unit tests covering happy path + the edge cases identified in step 2
- New endpoint → integration test covering auth, validation, happy path, one error path
- New UI → at minimum, build passes and manual verification steps documented

State your proposal and run it unless the user objects.

```bash
pnpm test:unit    # unit
pnpm test         # integration
pnpm build        # type check
```

If anything fails: fix it. If you can't fix it after 2 attempts, stop and report — do not push broken code.

Review `git diff` and confirm:

- The change matches the approved plan
- No files outside the plan were modified
- No debug logs, commented-out code, or `TODO`s left behind
- The domain spec (if written) is included in the diff

### 6. Confirm, commit, push, PR

Show a summary: files modified/created, what each does, how it maps to the domain spec. Then ask:

> "Ready to commit, push, and open the PR?"

On approval:

```bash
git add <relevant files>   # never git add -A — include docs/features/<slug>/domain.md if written
git commit -m "feat: <concise English description>" --no-verify
git push -u origin <branch-name>

gh pr create \
  --base develop \
  --title "feat: <same as commit>" \
  --body "$(cat <<'EOF'
## Summary
- <what this feature does, in 1–2 sentences>
- <why it's being added / what user need it serves>

## Spec
See `docs/features/<slug>/domain.md` for the full spec. Highlights:
- Acceptance criteria: <bullets>
- Edge cases handled: <bullets>
- Out of scope: <bullets>

## Changes
- <data model changes, if any>
- <new endpoints / API surface>
- <key implementation notes>

## Test plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification: <concrete steps to reproduce the happy path>
- [ ] Edge case verification: <what to try>

## Follow-ups
- <anything deferred during implementation, with brief context>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

For Light features (no domain spec file), inline the spec bullets directly under `## Spec` instead of referencing the file.

If `gh pr create` fails: report the error, leave the branch pushed, stop.

### 7. Write the technical spec (Deep only)

After the PR is open, write `docs/features/<slug>/technical.md` describing what was actually built. This is documentation, not a plan — it reflects reality.

Structure:

```markdown
# <Feature name> — Technical

## Architecture
<how the feature fits into the system: layers, components, data flow>

## Data model
<tables/columns added or changed, indexes, migrations, backfill notes>

## API contract
<endpoints with request/response shape, auth requirements, error codes>

## Key files
- `<path>` — <responsibility>
- `<path>` — <responsibility>

## Notable choices
<non-obvious decisions and the reasoning — e.g. "used X over Y because Z">

## Deviations from the original plan
<what changed during implementation vs the chat-plan in step 4, and why>

## Operational notes
<anything ops/oncall should know: feature flags, env vars, rollout order, rollback procedure>
```

Commit and push to the same branch:

```bash
git add docs/features/<slug>/technical.md
git commit -m "docs: technical spec for <feature name>" --no-verify
git push
```

The PR will pick up the new commit automatically.

### 8. Resolve and close

Post a comment on the task via `mcp__gitscrum__comment` (action: add). Write in French, no markdown, use line breaks between sections:

- **Fonctionnalité livrée**: what was built, in user-facing terms, one or two sentences
- **Périmètre**: the main behaviors covered (the acceptance criteria, restated)
- **Implémentation**: the technical approach — main files, data model changes, new endpoints
- **Hors périmètre**: anything explicitly excluded or deferred
- **Documentation**: paths to `domain.md` and (if Deep) `technical.md`
- **PR**: GitHub PR URL

Then move the task to Done:

1. Fetch columns via `mcp__gitscrum__project` (action: workflows)
2. Pick a sprint-specific done column matching the current sprint (e.g. "DONE -> 24 AVRIL") if one exists; otherwise the generic "Done"
3. Update via `mcp__gitscrum__task` (action: update) with `workflow_id`

Report the PR URL, the doc paths written, and the column name used.

---

## Failure handling

At any step, if a command fails unexpectedly: stop, report the error verbatim, and wait for instructions. Do not retry destructive operations or improvise around tool failures.

## Anti-patterns to avoid

- **Starting to code before spec is locked.** If you catch yourself thinking "I'll just start and figure it out" — stop. Go back to step 2.
- **Asking questions one at a time.** Batch them.
- **Treating the ticket as the full spec.** Tickets are starting points. The spec is the file in `docs/features/<slug>/domain.md` (Medium/Deep) or the agreed-upon bullets in chat (Light).
- **Silent scope expansion.** Every file touched should be traceable to the approved plan or to an explicit "yes, add it" mid-flight.
- **Writing the technical spec before implementation.** It will be wrong. The plan in step 4 is enough of an anchor — the spec comes after, when you know what was actually built.
- **Letting the domain spec drift.** If implementation reveals a behavior change that affects what the feature *does* (not just how), update `domain.md` in the same PR.