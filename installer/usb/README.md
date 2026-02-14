# Bootable USB Installer

This directory provides scripts to write the generated ISO to a USB drive.

## Prerequisites

- A built ISO (from `make build-iso-linux` or CI artifact)
- USB drive >= 8GB
- Administrator privileges

## Linux

1. Find USB device:

```bash
lsblk
```

2. Write installer:

```bash
bash installer/usb/write-usb-linux.sh <iso-path> <usb-device>
```

Example:

```bash
bash installer/usb/write-usb-linux.sh installer/live/work/live-image-amd64.hybrid.iso /dev/sdb
```

## macOS

1. Find disk id:

```bash
diskutil list
```

2. Write installer:

```bash
bash installer/usb/write-usb-macos.sh <iso-path> <disk-id>
```

Example:

```bash
bash installer/usb/write-usb-macos.sh ~/Downloads/live-image-amd64.hybrid.iso disk4
```

## Safety

These scripts overwrite the target disk. Confirm the device identifier carefully.
