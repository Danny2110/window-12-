#!/usr/bin/env bash
set -euo pipefail

# Installs Rust toolchain for this project and verifies cargo is available.
if command -v cargo >/dev/null 2>&1; then
  echo "cargo already installed: $(cargo --version)"
  exit 0
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to install Rust" >&2
  exit 1
fi

echo "Installing Rust toolchain via rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/rustup-init.sh
sh /tmp/rustup-init.sh -y

# shellcheck disable=SC1091
source "$HOME/.cargo/env"

if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust install completed but cargo not found in PATH" >&2
  exit 1
fi

echo "Rust ready: $(cargo --version)"
