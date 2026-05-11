#!/usr/bin/env bash
set -euo pipefail

cd /workspace

pnpm install --frozen-lockfile
pnpx playwright install --with-deps

echo "Devcontainer ready. Run: pnpm dev"
