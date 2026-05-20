# Devcontainer

Sandboxes Claude Code (and any dev work) in a Linux container so the host stays clean. The whole repo is bind-mounted at `/workspace`.

## Open it

- **VS Code**: command palette → `Dev Containers: Reopen in Container`.
- **CLI**: `devcontainer up --workspace-folder .` then `devcontainer exec --workspace-folder . bash`.

First boot builds the image, brings up `database` (postgres 16 from the root `docker-compose.yaml`), then runs `pnpm install --frozen-lockfile`.

## What's inside

- Node `24.15.0` + pnpm `11.0.6` (matches `volta` pin in root `package.json`)
- `@anthropic-ai/claude-code` installed globally — run `claude` directly
- `psql`, `git`, build tools for native deps
- Postgres reachable as `database:5432` (user/pass/db: `backend_user` / `backend_user` / `database_dev`)

## Mounts

| Path in container             | Source                          | Mode |
| ----------------------------- | ------------------------------- | ---- |
| `/workspace`                  | repo root                       | rw   |
| `/home/node/.claude`          | host `~/.claude` (skills, etc.) | ro   |
| `/workspace/node_modules`     | named volume `node-modules-cache` | rw |
| `/home/node/.local/share/pnpm/store` | named volume `pnpm-store` | rw |

`node_modules` and the pnpm store are on named volumes, not bind mounts — keeps native modules (`better-sqlite3`) Linux-built and installs fast on macOS.

## Forwarded ports

- `4200` — Ember/Vite frontend
- `5432` — Postgres (so you can `psql` from the host if needed)
- `6080` — noVNC web viewer (Playwright headed runs / codegen). Open the forwarded port in a browser; password is `vscode`. Provided by the `desktop-lite` devcontainer feature.
- `51204` — Vitest UI

## Notes

- `~/.claude` is read-only. If Claude Code needs to write session state and you see errors, switch the mount to rw in `docker-compose.yml` or set `CLAUDE_CONFIG_DIR` to a writable path.
- The root `docker-compose.yaml` is unchanged — `docker compose up` from the host still works exactly as before.
