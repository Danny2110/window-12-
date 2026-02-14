# Install-Ready ISO and USB Plan

## Build ISO (Linux builder)

```bash
cd /Users/soares10/windows12-style-os
make build-iso-linux
```

Expected artifact:

- `installer/live/work/live-image-amd64.hybrid.iso`

## Write Bootable USB

Linux:

```bash
bash installer/usb/write-usb-linux.sh installer/live/work/live-image-amd64.hybrid.iso /dev/sdX
```

macOS:

```bash
bash installer/usb/write-usb-macos.sh ~/Downloads/live-image-amd64.hybrid.iso diskN
```

## Installer Boot Test

- Boot target machine from USB.
- Launch live environment.
- Validate:
  - network available
  - storage visible
  - desktop shell starts
  - core services health endpoints report `healthy`

## Current maturity

- This is an installable developer preview path.
- Full Windows replacement parity is under active phased implementation.
