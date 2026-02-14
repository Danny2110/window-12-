#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
WORK_DIR="$ROOT_DIR/installer/live/work"
OVERLAY_DIR="$WORK_DIR/includes.chroot/opt/windows12"
export DEBIAN_FRONTEND=noninteractive

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
    sudo apt-get update -y
    sudo apt-get install -y --no-install-recommends live-build debootstrap squashfs-tools xorriso
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
unzip
libarchive-tools
PKGS

pushd "$WORK_DIR" >/dev/null
lb config \
  --mode debian \
  --distribution bookworm \
  --debian-installer live \
  --archive-areas "main contrib non-free" \
  --mirror-bootstrap "http://deb.debian.org/debian/" \
  --mirror-chroot "http://deb.debian.org/debian/" \
  --mirror-chroot-security "http://deb.debian.org/debian-security/" \
  --mirror-binary "http://deb.debian.org/debian/" \
  --mirror-binary-security "http://deb.debian.org/debian-security/" \
  --security true
mkdir -p config/package-lists config/includes.chroot
cp package-lists.list.chroot config/package-lists/windows12.list.chroot
cp -R includes.chroot/* config/includes.chroot/
mkdir -p config/archives
cat > config/archives/aster.list.chroot <<'SRC'
deb http://deb.debian.org/debian bookworm main contrib non-free
deb http://deb.debian.org/debian bookworm-updates main contrib non-free
deb http://deb.debian.org/debian-security bookworm-security main contrib non-free
SRC
cat > config/archives/aster.list.binary <<'SRC'
deb http://deb.debian.org/debian bookworm main contrib non-free
deb http://deb.debian.org/debian bookworm-updates main contrib non-free
deb http://deb.debian.org/debian-security bookworm-security main contrib non-free
SRC
# Force correct Debian Bookworm security suite naming (bookworm-security).
find config -type f -name "*.list*" -o -name "sources.list*" | while read -r f; do
  sed -i 's#security.debian.org[[:space:]]\\+bookworm/updates#deb.debian.org/debian-security bookworm-security#g' "$f" || true
done

echo "Starting lb build..."
if ! sudo lb build 2>&1 | tee "$WORK_DIR/lb-build.log"; then
  echo "lb build failed; last 200 lines:"
  tail -n 200 "$WORK_DIR/lb-build.log" || true
  exit 100
fi
# live-build creates root-owned cache trees; hand ownership back to runner for CI artifact steps.
sudo chown -R "$(id -u):$(id -g)" "$WORK_DIR" || true
popd >/dev/null

echo "ISO build complete. Check: $WORK_DIR/live-image-amd64.hybrid.iso"
