# Full OS Replacement Roadmap

## Phase A (0-3 months) - Core Platform Bootstrap

- Build custom non-Ubuntu base image pipeline.
- Kernel patch baseline and boot validation.
- HAL services skeleton.
- Initial desktop session and compositor startup.

Exit gate:

- Boot to desktop with installer image and recovery shell.

## Phase B (3-6 months) - Windows Workflow Foundation

- `compatd`, `regd`, `fsd` MVP.
- `.exe` launch for Tier A productivity apps.
- Start/taskbar/search/notifications shell MVP.
- Terminal + PowerShell integration.

Exit gate:

- 40% pass on Tier A app matrix.

## Phase C (6-10 months) - Full Desktop and Core Apps

- File Explorer, Settings, Task Manager, App Installer, Browser MVP.
- Disk Manager and Device Manager baseline.
- Accessibility baseline and multi-monitor support.

Exit gate:

- Daily-driver basic workflows validated.

## Phase D (10-14 months) - Gaming and Advanced Compatibility

- DirectX translation hardening.
- Controller and fullscreen optimization.
- Installer reliability and game profile subsystem.

Exit gate:

- 60% compatibility on target game/app matrix.

## Phase E (14-18 months) - Security and Enterprise Hardening

- Defender-style scanning pipeline.
- Policy framework and sandbox profiles.
- Signed A/B updates + rollback verification.

Exit gate:

- Security baseline + rollback tests pass.

## Phase F (18-24 months) - Public Beta and Hardware Certification

- Hardware certification matrix (Wi-Fi, BT, printers, GPU families).
- Performance optimization on low-end hardware.
- Public beta with telemetry-informed compatibility fixes.

Exit gate:

- Public beta ready with compatibility dashboard and known issue catalog.

