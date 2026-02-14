#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
WORK_DIR="$ROOT_DIR/installer/live/work"
OVERLAY_DIR="$WORK_DIR/includes.chroot/opt/windows12"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_cmd sudo

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "ISO build is supported only on Linux hosts." >&2
  exit 1
fi

if ! command -v lb >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    echo "Installing live-build dependencies..."
    sudo apt-get update
    sudo apt-get install -y live-build debootstrap squashfs-tools xorriso
  else
    echo "Missing required command: lb (live-build)" >&2
    exit 1
  fi
fi

rm -rf "$WORK_DIR"
mkdir -p "$OVERLAY_DIR/bin" "$OVERLAY_DIR/apps" "$OVERLAY_DIR/testing"

echo "Building binaries..."
( cd "$ROOT_DIR" && cargo build --workspace )

cp "$ROOT_DIR/target/debug/compatd" "$OVERLAY_DIR/bin/"
cp "$ROOT_DIR/target/debug/updated" "$OVERLAY_DIR/bin/"
cp "$ROOT_DIR/target/debug/aid" "$OVERLAY_DIR/bin/"
cp -R "$ROOT_DIR/apps/extractx" "$OVERLAY_DIR/apps/"
cp -R "$ROOT_DIR/testing/harness" "$OVERLAY_DIR/testing/"
cp -R "$ROOT_DIR/testing/matrix" "$OVERLAY_DIR/testing/"

cat > "$WORK_DIR/package-lists.list.chroot" <<PKGS
python3
python3-tk
p7zip-full
unrar-free
unzip
PKGS

pushd "$WORK_DIR" >/dev/null
lb config --mode debian --distribution bookworm --debian-installer live --archive-areas "main contrib non-free"
mkdir -p config/package-lists config/includes.chroot
cp package-lists.list.chroot config/package-lists/windows12.list.chroot
cp -R includes.chroot/* config/includes.chroot/

sudo lb build
# live-build creates root-owned cache trees; hand ownership back to runner for CI artifact steps.
sudo chown -R "$(id -u):$(id -g)" "$WORK_DIR" || true
popd >/dev/null

echo "ISO build complete. Check: $WORK_DIR/live-image-amd64.hybrid.iso"
