#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: test-in-qemu.sh <installer.iso|disk.img> [ram_mb] [cpus]" >&2
  exit 1
fi

IMAGE="$1"
RAM_MB="${2:-4096}"
CPUS="${3:-2}"

if ! command -v qemu-system-x86_64 >/dev/null 2>&1; then
  echo "qemu-system-x86_64 not found" >&2
  exit 1
fi

if [[ ! -f "$IMAGE" ]]; then
  echo "Image not found: $IMAGE" >&2
  exit 1
fi

ACCEL_ARGS=()
if [[ "$(uname -s)" == "Darwin" ]]; then
  ACCEL_ARGS=(-accel hvf)
else
  ACCEL_ARGS=(-enable-kvm)
fi

if [[ "$IMAGE" == *.iso ]]; then
  qemu-system-x86_64 \
    -m "$RAM_MB" \
    -smp "$CPUS" \
    "${ACCEL_ARGS[@]}" \
    -cdrom "$IMAGE" \
    -boot d \
    -display default
else
  qemu-system-x86_64 \
    -m "$RAM_MB" \
    -smp "$CPUS" \
    "${ACCEL_ARGS[@]}" \
    -drive file="$IMAGE",format=qcow2 \
    -boot c \
    -display default
fi
