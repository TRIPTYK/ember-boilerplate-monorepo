# Feature
 
End-to-end workflow to build a gitScrum feature task: interrogate → spec → plan → build → verify → ship → document.
 
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
 
## Calibration: what good interrogation looks like
 
The single most common failure mode is treating the spec axes as a checklist to skim rather than a probe to push on. A "Success Criteria" section in the ticket does **not** mean acceptance criteria are clear — it usually means they're written in vague product-speak that needs decomposition.
 
**Bad question** — restating what the ticket already says:
> "Should the invoice display correctly in the browser?"
 
**Good question** — surfacing the unspecified noun:
> "The ticket says 'invoice with user details.' Which fields exactly — name, address, VAT/tax ID, customer ID? And where does this data live today: on the user entity, a billing-profile entity, somewhere else?"
 
**Bad question** — asking only what the ticket asks:
> "What should happen when the user selects a month?"
 
**Good question** — pushing into edge cases the ticket ignored:
> "What happens for: a future month? A month before the user signed up? A month where every charge was refunded? A timezone-boundary case where 'January' depends on whether you mean user-local, company-local, or UTC?"
 
**Bad assumption** — filled in silently:
> "No special handling required for months with no billing data."
 
**Good behavior** — either ask, or surface as a flagged assumption:
> "ASSUMPTION: empty months return an empty invoice rather than a 404. Confirm or correct."
 
The rule: **if you don't know it, ask it or flag it. Never silently default.**
 
---
 
### 1. Fetch and assess complexity
 
Fetch the task via `mcp__gitscrum__task` (detail with comments & files).
 
Read the title, description, and any attached files. Then classify the task on this axis (state your classification explicitly to the user):
 
- **Light** — CRUD on existing entity, copy change, isolated UI tweak, well-trodden pattern in the codebase
- **Medium** — new endpoint with non-trivial logic, new screen, integration with one existing subsystem
- **Deep** — new domain concept, new external integration, anything touching auth/permissions, anything with a data migration, anything ambiguous about what "done" means
The classification determines the question budget in step 2 **and** which specs get written. **Err toward Deep** when uncertain — the cost of one extra round of questions and one extra doc is much lower than the cost of a wrong-direction PR.
 
### 2. Interrogate (questions only — no answers, no spec)
 
This step has one rule: **you are only allowed to ask questions. You may not propose answers, write the spec, or fill in assumptions.** Synthesis happens in step 2b after the user answers.
 
For each axis below, run the probes. Skip an axis only if the ticket gives a precise, unambiguous answer — and quote the ticket text proving it ("Auth is specified: 'only the user themselves' — no question needed").
 
#### Axis 1 — Acceptance criteria
 
For each success criterion in the ticket, identify the **unspecified nouns** and ask about each. Vague nouns to look for: "details", "information", "correctly", "properly", "fields", "data".
 
Probe: "The ticket says X. Which exact fields/values/behaviors does that mean? Where does the data come from?"
 
#### Axis 2 — Edge cases & error states
 
List at minimum **5 edge cases** for this feature, even if the ticket mentions none. Then ask the user the expected behavior for each. Categories to cover:
 
- Empty / no-data inputs
- Boundary values (future date, past date before account existed, zero amounts)
- Concurrent / stale data
- Failure paths (downstream service down, generation fails, network error)
- Timezone, locale, currency, language where relevant
#### Axis 3 — Data model & persistence
 
Ask explicitly: **does this feature need persistent storage, or can it be derived on-the-fly from existing data?** Both options have trade-offs — name them. For features that look like records (invoices, audit logs, contracts, reports), raise legal/regulatory implications of persistence vs derivation (immutability, sequential numbering, retention).
 
If new tables/columns are likely: which entity owns them, what's the relationship, are existing rows nullable, is a backfill needed?
 
#### Axis 4 — API contract & breaking changes
 
For each new endpoint: who calls it, what's the request shape, what's the response shape, what status codes? For each modified endpoint or response: who consumes it today, will the change break them, do we need versioning?
 
#### Axis 5 — Auth & permissions
 
Default-skeptical: "the user themselves" is rarely the full answer. Ask:
 
- Only the resource owner, or also admins/support/accountants?
- Does support need a read-only path for handling user complaints?
- New permission/scope/policy, or fits an existing one?
- What's the failure mode if auth check fails — 403, 404, redirect?
#### Axis 6 — UX / display (when UI is involved)
 
Specific layout requirements, branding, language(s), responsive behavior, print/export rendering, loading/empty/error states, copy and translations.
 
#### Question budget by complexity
 
- **Light**: 2–4 questions, only on axes the ticket genuinely leaves open
- **Medium**: 5–8 questions covering the axes that matter
- **Deep**: 8+ questions across all relevant axes — do not under-ask out of politeness
Ask **all questions for a given round in one numbered message**. Do not drip-feed.
 
If the answers reveal new questions, run another round. Continue until you can write the spec without filling in any silent defaults.
 
#### Self-check before sending the question batch
 
Before posting your questions, verify:
 
- [ ] Did I ask about every vague noun in the success criteria?
- [ ] Did I list at least 5 edge cases?
- [ ] Did I raise the persistence vs derivation question (if applicable)?
- [ ] Did I push past "the user themselves" on auth?
- [ ] Are any of my questions just restating the ticket back? (If yes, delete them.)
- [ ] Am I about to fill in any default silently? (If yes, ask instead.)
If any box is unchecked, revise the batch before sending.
 
### 2b. Synthesize and write the domain spec (Medium and Deep only)
 
Only after the user has answered the questions and you have no remaining unknowns: write the domain spec to `docs/features/<slug>/domain.md`.
 
Structure:
 
```markdown
# <Feature name>
 
## Purpose
<1–2 sentences: what this feature does and why it exists>
 
## User stories
- As a <role>, I want <capability>, so that <outcome>
 
## Acceptance criteria
- <observable behavior 1, with concrete fields/values from the user's answers>
- <observable behavior 2>
 
## Business rules & invariants
- <rule 1>
- <rule 2>
 
## Edge cases & error states
- <case>: <expected behavior, from user's answer>
 
## Out of scope
- <what is explicitly NOT being built>
 
## Assumptions
<Anything you filled in without an explicit answer from the user. Each assumption must be one line, prefixed with the axis it falls under, and phrased as a falsifiable statement the user can confirm or reject. If this section is empty, say so explicitly.>
 
- [Auth] Support agents do NOT have access to other users' invoices.
- [Timezone] "January 2025" means 2025-01-01 to 2025-01-31 in Europe/Brussels timezone.
 
## Technical approach (Deep only — 3–5 bullets)
- <layers touched>
- <integration points>
- <non-obvious choices>
```
 
The **Assumptions** section is mandatory. If you have no assumptions, write "None — every decision was confirmed by the user." Empty/missing Assumptions sections are not acceptable; either you asked enough questions (good) or you're hiding silent defaults (not good).
 
Show the file to the user and ask:
 
> "Domain spec written to `docs/features/<slug>/domain.md`. Please review the Assumptions section in particular. Approve to proceed, or flag changes."
 
Do not proceed to step 3 until the user approves.
 
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
 
- New service/business logic → unit tests covering happy path + the edge cases identified in step 2 + at least one **error scenario** (thrown exception, invalid input, downstream failure)
- New endpoint → integration test covering auth, validation, happy path, **and one or more error scenarios** (401/403, 422 validation failure, 404, downstream/dependency failure where relevant)
- New UI → at minimum, build passes and manual verification steps documented, including how the UI behaves on error states (failed request, empty result, permission denied)
 
Error scenarios are **not optional**. If you cannot identify a meaningful error path to test, say so explicitly and ask the user to confirm before skipping. The error-path tests should map directly to the failure-mode edge cases identified in step 2, axis 2.
 
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
git commit -m "$(cat <<'EOF'
feat: <concise English description>

<1–3 short sentences explaining the WHY — the non-obvious motivation, constraint, or decision behind this change. Skip restating what the diff already shows. This is redundant with the GitScrum task and PR, but lives in `git blame` for future readers who want context without hunting down the ticket.>
EOF
)" --no-verify
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
 
### 8. Self-audit (sub-agent)
 
Before closing the task, spawn a **read-only** sub-agent (`subagent_type: general-purpose`) to verify the workflow was followed. This guards against mechanical omissions (missing Assumptions section, empty commit body, no error-path test, missing technical.md for Deep). It does **not** judge content quality — that's review's job.
 
Pass the agent the following context:
 
- Task UUID and title
- Feature slug
- Branch name
- PR URL
- Complexity classification (Light / Medium / Deep)
- Base branch (`develop`)
 
Ask the agent to check, in one report:
 
1. **Domain spec** (Medium/Deep) — `docs/features/<slug>/domain.md` exists, has an `## Assumptions` section that is either explicitly "None — every decision was confirmed by the user." or contains at least one prefixed bullet (e.g. `[Auth] ...`). Empty/missing = GAP.
2. **Technical spec** (Deep only) — `docs/features/<slug>/technical.md` exists with all sections from the template (Architecture, Data model, API contract, Key files, Notable choices, Deviations, Operational notes).
3. **Commit messages** — every commit on the branch since `develop` has a subject line AND a non-empty body explaining the WHY (not just `feat: X` alone). Use `git log develop..HEAD --format='%H%n%s%n%b%n---'`.
4. **Error-path tests** — diff includes at least one test exercising a failure scenario (grep the diff for patterns: `toThrow`, `.rejects`, `it('throws'`, `it('rejects'`, `it('error`, `it('fails`, status codes `401|403|404|422|5\d\d` in test files). If none found, GAP — unless the user explicitly waived tests in step 5.
5. **PR body** — fetched via `gh pr view <url> --json body`, contains the sections `## Summary`, `## Spec`, `## Changes`, `## Test plan`. Empty sections = GAP.
6. **Scope** — `git diff develop..HEAD --name-only` doesn't include files unrelated to the feature (e.g. random formatter sweeps, lockfile churn without dep changes, unrelated config edits). Flag suspicious entries; the main agent will decide if they're legitimate.
7. **Hygiene** — no `console.log`, `debugger`, `TODO`/`FIXME` added by this branch, no commented-out code blocks. Use `git diff develop..HEAD`.
 
The agent must return a structured report:
 
```
STATUS: PASS | GAPS
 
GAPS:
- [check N] <one-line description> — <file:line or evidence>
- ...
 
NOTES:
- <anything worth surfacing that isn't a hard gap>
```
 
Cap the report at ~300 words. The agent should **not** modify files, push, or comment on the task — it only reports.
 
On PASS: proceed to step 9.
 
On GAPS: show the report to the user, fix the gaps (or get explicit waiver per gap), then re-run the audit. Do not skip to step 9 with open gaps unless the user explicitly accepts them.
 
### 9. Resolve and close
 
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
 
- **Skimming the axes as a checklist.** Each axis is a probe, not a tickbox. If you wrote a generic "what should happen?" question, you didn't probe — go back and decompose the unspecified nouns.
- **Confusing "the ticket has a Success Criteria section" with "acceptance criteria are clear."** Vague success criteria are the most common case. Decompose them.
- **Silently filling in defaults.** If you didn't ask, it goes in the Assumptions section. Period.
- **Mixing questions and answers in step 2.** Step 2 is questions only. Synthesis happens in 2b.
- **Drip-feeding questions.** Batch them. Numbered. One message.
- **Starting to code before spec is locked.** If you catch yourself thinking "I'll just start and figure it out" — stop. Go back to step 2.
- **Treating the ticket as the full spec.** Tickets are starting points. The spec is the file in `docs/features/<slug>/domain.md` (Medium/Deep) or the agreed-upon bullets in chat (Light).
- **Silent scope expansion.** Every file touched should be traceable to the approved plan or to an explicit "yes, add it" mid-flight.
- **Writing the technical spec before implementation.** It will be wrong. The plan in step 4 is enough of an anchor — the spec comes after, when you know what was actually built.
- **Letting the domain spec drift.** If implementation reveals a behavior change that affects what the feature *does* (not just how), update `domain.md` in the same PR.
 