#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: extractx-cli.sh <archive> <destination>" >&2
  exit 1
fi

archive="$1"
destination="$2"
mkdir -p "$destination"

case "$archive" in
  *.zip)
    unzip -o "$archive" -d "$destination"
    ;;
  *.tar|*.tar.gz|*.tgz|*.tar.bz2|*.tbz2|*.tar.xz|*.txz)
    tar -xf "$archive" -C "$destination"
    ;;
  *.rar|*.7z)
    if command -v 7z >/dev/null 2>&1; then
      7z x -y "-o$destination" "$archive"
    elif command -v unar >/dev/null 2>&1; then
      unar -o "$destination" "$archive"
    elif command -v unrar >/dev/null 2>&1; then
      unrar x -o+ "$archive" "$destination"
    elif command -v bsdtar >/dev/null 2>&1; then
      bsdtar -xf "$archive" -C "$destination"
    else
      echo "Need one of: 7z, unar, unrar, bsdtar" >&2
      exit 2
    fi
    ;;
  *)
    echo "Unsupported archive: $archive" >&2
    exit 3
    ;;
esac

echo "Extracted to $destination"
