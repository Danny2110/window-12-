# Install + Test Guide

## A. Build an install-ready artifact

```bash
cd /Users/soares10/windows12-style-os
make package-preview
```

Verify checksum:

```bash
cd /Users/soares10/windows12-style-os/dist
shasum -a 256 -c *.sha256
```

## B. Optional ISO (Linux host)

```bash
cd /Users/soares10/windows12-style-os
make build-iso-linux
```

## C. VM smoke test path

1. Create VM (VirtualBox/UTM/QEMU):
- CPU: 2+
- RAM: 4096 MB minimum (8192 MB recommended)
- Disk: 32 GB+

2. Boot VM:
- If ISO: boot from `installer/live/work/live-image-amd64.hybrid.iso`
- If package: mount/extract tarball and run components manually.

3. Run platform checks inside VM:

```bash
/opt/windows12/bin/compatd --health
/opt/windows12/bin/updated --health
/opt/windows12/bin/aid --health
python3 /opt/windows12/apps/extractx/extractx.py
bash /opt/windows12/testing/harness/run_compat.sh
```

## D. Local preflight tests

```bash
cd /Users/soares10/windows12-style-os
make build
make pycheck
make smoke-extractx
make test-harness
```

## E. Pass criteria

- Rust workspace builds cleanly.
- ExtractX smoke test passes.
- Harness runs and writes `testing/results/<timestamp>/summary.json`.
- Health endpoints for all three daemons return `healthy`.
