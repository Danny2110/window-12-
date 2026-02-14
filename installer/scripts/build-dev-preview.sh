#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PROFILE_FILE="$ROOT_DIR/installer/profiles/dev-preview.env"
DIST_DIR="$ROOT_DIR/dist"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"

if [[ -f "$PROFILE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$PROFILE_FILE"
else
  CHANNEL="dev-preview"
  VERSION="0.1.0"
fi

ARTIFACT_NAME="windows12-style-os-${CHANNEL}-${VERSION}-${TIMESTAMP}"
STAGE_DIR="$DIST_DIR/$ARTIFACT_NAME"
BIN_DIR="$STAGE_DIR/opt/windows12/bin"
APP_DIR="$STAGE_DIR/opt/windows12/apps"
TEST_DIR="$STAGE_DIR/opt/windows12/testing"
META_DIR="$STAGE_DIR/meta"

rm -rf "$STAGE_DIR"
mkdir -p "$BIN_DIR" "$APP_DIR" "$TEST_DIR" "$META_DIR"

echo "Building Rust workspace..."
( cd "$ROOT_DIR" && cargo build --workspace )

cp "$ROOT_DIR/target/debug/compatd" "$BIN_DIR/"
cp "$ROOT_DIR/target/debug/updated" "$BIN_DIR/"
cp "$ROOT_DIR/target/debug/aid" "$BIN_DIR/"
cp -R "$ROOT_DIR/apps/extractx" "$APP_DIR/"
cp -R "$ROOT_DIR/testing/harness" "$TEST_DIR/"
cp -R "$ROOT_DIR/testing/matrix" "$TEST_DIR/"
cp "$ROOT_DIR/installer/manifest.yaml" "$META_DIR/"

cat > "$META_DIR/BUILD_INFO.txt" <<INFO
artifact=$ARTIFACT_NAME
channel=${CHANNEL}
version=${VERSION}
timestamp=${TIMESTAMP}
commit=$(cd "$ROOT_DIR" && git rev-parse --short HEAD 2>/dev/null || echo "no-git")
INFO

( cd "$DIST_DIR" && tar -czf "${ARTIFACT_NAME}.tar.gz" "$ARTIFACT_NAME" )
( cd "$DIST_DIR" && shasum -a 256 "${ARTIFACT_NAME}.tar.gz" > "${ARTIFACT_NAME}.sha256" )

echo "Created: $DIST_DIR/${ARTIFACT_NAME}.tar.gz"
echo "Checksum: $DIST_DIR/${ARTIFACT_NAME}.sha256"
