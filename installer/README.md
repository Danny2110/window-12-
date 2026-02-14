# Installer Pipeline

This project now supports two installer-oriented outputs.

## 1) Developer Preview Package (portable)

Produces a signed-checksum tarball containing binaries, apps, and test assets.

```bash
cd /Users/soares10/windows12-style-os
bash installer/scripts/build-dev-preview.sh
```

Outputs in `dist/`:

- `windows12-style-os-dev-preview-...tar.gz`
- `windows12-style-os-dev-preview-...sha256`

Use this for rapid VM testing and CI artifacts.

## 2) Linux ISO Build Path (experimental)

Builds a live ISO using Debian `live-build` (must run on Linux host with `lb` and `sudo`).

```bash
bash installer/scripts/build-iso-linux.sh
```

Expected output:

- `installer/live/work/live-image-amd64.hybrid.iso`

## VM Test

```bash
bash installer/scripts/test-in-qemu.sh <path-to-iso-or-qcow2> [ram_mb] [cpus]
```

- macOS: uses `hvf` acceleration.
- Linux: uses `kvm` acceleration.

## Bootable USB Installer

Use scripts in `installer/usb` after you have an ISO:

- Linux: `bash installer/usb/write-usb-linux.sh <iso-path> <usb-device>`
- macOS: `bash installer/usb/write-usb-macos.sh <iso-path> <disk-id>`
