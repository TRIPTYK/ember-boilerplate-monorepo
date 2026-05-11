#!/usr/bin/env bash
set -euo pipefail

cd /workspace

pnpm install --frozen-lockfile
pnpx playwright install --with-deps

P10K_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
if [ ! -d "$P10K_DIR" ]; then
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$P10K_DIR"
fi

if [ -f "$HOME/.zshrc" ]; then
  sed -i 's|^ZSH_THEME=.*|ZSH_THEME="powerlevel10k/powerlevel10k"|' "$HOME/.zshrc"
  if ! grep -q '\.p10k\.zsh' "$HOME/.zshrc"; then
    printf '\n[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh\n' >> "$HOME/.zshrc"
  fi
fi

if [ ! -f "$HOME/.p10k.zsh" ] && [ -f "$P10K_DIR/config/p10k-lean.zsh" ]; then
  cp "$P10K_DIR/config/p10k-lean.zsh" "$HOME/.p10k.zsh"
fi

if command -v code-insiders >/dev/null 2>&1; then
  git config --global core.editor "code-insiders --wait"
elif command -v code >/dev/null 2>&1; then
  git config --global core.editor "code --wait"
fi

echo "Devcontainer ready. Run: pnpm dev"
