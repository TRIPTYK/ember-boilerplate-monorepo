# AGENTS.md

Ember 6 frontend + Fastify 5 backend monorepo (pnpm workspaces + Turborepo). See `README.md` for setup.

## Features

Each feature is a `@libs/<feature>-front` / `@libs/<feature>-backend` pair, wired into `@apps/front` and `@apps/backend`. `todos` is the reference feature: copy its structure.

## Standards

Project conventions live in `agent-os/standards/`. Read `agent-os/standards/index.yml` first, then the files relevant to your task (e.g. `frontend/form-pattern.md` before writing a form).

## Forms

Always use the most specific prefab from `@triptyk/ember-input-validation` (phone → `TpkMobilePrefab`, IBAN → `TpkIbanPrefab`, BIC → `TpkBicPrefab`, VAT → `TpkVatPrefab`, amount → `TpkCurrencyPrefab`, date → `TpkDatepickerPrefab`…). `TpkInputPrefab` is only for free text.

Catalogue of available prefabs and their arguments: `@apps/front/node_modules/@triptyk/ember-input-validation/README.md`. Docs site for humans (client-rendered, not readable by agents): https://triptyk.github.io/ember-common-ui/.

## Checks

After a change, run from the root:

```bash
pnpm turbo lint                      # always, on the whole repo (pnpm turbo lint:fix to auto-fix)
pnpm --filter <package> test         # only on the packages you modified
```

Commits follow Conventional Commits (enforced by Lefthook).
