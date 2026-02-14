#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: write-usb-macos.sh <iso-path> <disk-id>" >&2
  echo "Example: write-usb-macos.sh dist/aster.iso disk4" >&2
  exit 1
fi

ISO="$1"
DISK_ID="$2"
RAW_DEV="/dev/r${DISK_ID}"

if [[ ! -f "$ISO" ]]; then
  echo "ISO not found: $ISO" >&2
  exit 1
fi

if ! diskutil info "$DISK_ID" >/dev/null 2>&1; then
  echo "Disk not found: $DISK_ID" >&2
  exit 1
fi

echo "Target disk: $DISK_ID"
diskutil list "$DISK_ID" || true
read -r -p "Type 'ERASE' to continue: " confirm
if [[ "$confirm" != "ERASE" ]]; then
  echo "Cancelled"
  exit 1
fi

sudo diskutil unmountDisk force "$DISK_ID"
sudo dd if="$ISO" of="$RAW_DEV" bs=4m status=progress
sync
sudo diskutil eject "$DISK_ID"

echo "Done. USB installer written to $DISK_ID"
