#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: write-usb-linux.sh <iso-path> <usb-device>" >&2
  echo "Example: write-usb-linux.sh dist/aster.iso /dev/sdb" >&2
  exit 1
fi

ISO="$1"
USB_DEV="$2"

if [[ ! -f "$ISO" ]]; then
  echo "ISO not found: $ISO" >&2
  exit 1
fi

if [[ ! -b "$USB_DEV" ]]; then
  echo "USB block device not found: $USB_DEV" >&2
  exit 1
fi

echo "About to erase and write: $USB_DEV"
read -r -p "Type 'ERASE' to continue: " confirm
if [[ "$confirm" != "ERASE" ]]; then
  echo "Cancelled"
  exit 1
fi

sudo sync
sudo dd if="$ISO" of="$USB_DEV" bs=4M status=progress conv=fsync
sudo sync

echo "Done. You can now boot from USB device: $USB_DEV"
