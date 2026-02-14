#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
WORK_DIR="$ROOT_DIR/testing/tmp/extractx-smoke"
SRC_DIR="$WORK_DIR/src"
ARCHIVE_DIR="$WORK_DIR/archives"
OUT_ZIP="$WORK_DIR/out-zip"
OUT_TAR="$WORK_DIR/out-tar"

rm -rf "$WORK_DIR"
mkdir -p "$SRC_DIR" "$ARCHIVE_DIR" "$OUT_ZIP" "$OUT_TAR"

printf 'alpha\n' > "$SRC_DIR/a.txt"
printf 'bravo\n' > "$SRC_DIR/b.txt"

python3 - <<PY
import os
import tarfile
import zipfile

src = os.path.join(r"$SRC_DIR")
arch = os.path.join(r"$ARCHIVE_DIR")

with zipfile.ZipFile(os.path.join(arch, "sample.zip"), "w") as z:
    z.write(os.path.join(src, "a.txt"), arcname="a.txt")
    z.write(os.path.join(src, "b.txt"), arcname="b.txt")

with tarfile.open(os.path.join(arch, "sample.tar.gz"), "w:gz") as t:
    t.add(os.path.join(src, "a.txt"), arcname="a.txt")
    t.add(os.path.join(src, "b.txt"), arcname="b.txt")
PY

bash "$ROOT_DIR/apps/extractx/extractx-cli.sh" "$ARCHIVE_DIR/sample.zip" "$OUT_ZIP"
bash "$ROOT_DIR/apps/extractx/extractx-cli.sh" "$ARCHIVE_DIR/sample.tar.gz" "$OUT_TAR"

[[ -f "$OUT_ZIP/a.txt" ]] && [[ -f "$OUT_ZIP/b.txt" ]]
[[ -f "$OUT_TAR/a.txt" ]] && [[ -f "$OUT_TAR/b.txt" ]]

echo "ExtractX smoke test passed"
