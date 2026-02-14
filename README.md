# Windows 12-style OS

A practical blueprint and MVP plan for a modern desktop OS that preserves Windows 11 workflows, runs `.exe` apps, and adds local-first AI assistance while staying usable on 4-8 GB RAM hardware.

## Deliverables in this repository

- `docs/01-architecture-plan.md`: End-to-end OS architecture and subsystem boundaries
- `docs/02-kernel-and-compatibility.md`: Kernel approach and `.exe` compatibility strategy
- `docs/03-ui-system-design.md`: Glass UI, compositor, shell UX, and accessibility plan
- `docs/04-build-roadmap.md`: Step-by-step implementation roadmap with milestones
- `docs/05-mvp-prototype-plan.md`: MVP definition, acceptance criteria, and risk controls
- `docs/06-tech-stack.md`: Required languages, frameworks, and toolchain choices

## Core Product Direction

- Priority 1: Windows 11 compatibility and user workflow continuity
- Priority 2: Reliable `.exe` support (Win32 first, then advanced APIs)
- Priority 3: Strong performance on older laptops
- Priority 4: AI assistant that works offline
- Priority 5: Modern translucent desktop UX with low overhead

## Scope Reality

A full replacement for Microsoft Windows kernel/driver ecosystem is a multi-year effort. This plan uses a phased architecture:

1. Ship a Linux-based core with a **Windows compatibility subsystem** for fastest path to broad app support.
2. Add a **Windows-like shell** and first-party apps optimized for low memory.
3. Introduce AI assistant services with strict local privacy boundaries.
4. Evolve into a hardened, modular platform with enterprise-grade policy and update tooling.

## Implementation Assets Added

- Backlog: `planning/issues.md`, `planning/sprint-board.md`
- Daemon workspace: `Cargo.toml`, `crates/compatd`, `crates/updated`, `crates/aid`, `crates/platform-contracts`
- Compatibility harness: `testing/matrix/*`, `testing/harness/run_compat.sh`

## Quick Start

```bash
cd /Users/soares10/windows12-style-os
make bootstrap-rust
make build
make run-compatd
make run-updated
make run-aid
make pycheck
make smoke-extractx
make test-harness
make package-preview
make run-extractx
```

## Extraction App

- Functional app: `apps/extractx/extractx.py`
- CLI helper: `apps/extractx/extractx-cli.sh`
- UI concept preview: `apps/extractx/ui/index.html`

## Install-Ready Artifacts

- Installer docs: `installer/README.md`
- Portable preview package: `make package-preview` (outputs to `dist/`)
- ISO build path (Linux host): `make build-iso-linux`
- VM boot script: `installer/scripts/test-in-qemu.sh`
# window-12-
