#!/usr/bin/env bash
set -euo pipefail

cd /workspace

# Ensure a `code` command exists so EDITOR=code --wait works on both stable
# VSCode (ships `code`) and Insiders (ships only `code-insiders`).
mkdir -p "$HOME/.local/bin"
if ! command -v code >/dev/null 2>&1; then
  if command -v code-insiders >/dev/null 2>&1; then
    ln -sf "$(command -v code-insiders)" "$HOME/.local/bin/code"
  fi
fi

pnpm install --frozen-lockfile

echo "Devcontainer ready. Run: pnpm dev"
