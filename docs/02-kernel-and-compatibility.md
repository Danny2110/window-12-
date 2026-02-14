# Kernel Approach and Compatibility Strategy

## 1. Kernel Decision

## Recommended: Linux LTS + Windows Compatibility Subsystem

Reasoning:

- Delivers fastest path to broad hardware support (critical for older laptops).
- Reuses mature drivers and power management.
- Allows focus on Windows app/runtime compatibility and shell UX.

## Alternative: Custom hybrid kernel

- Not recommended for initial product.
- High risk for driver support, stability, and schedule.
- Better treated as long-term R&D track after market fit.

## 2. `.exe` Execution Model

## PE Loader Pipeline

1. User launches `.exe` from shell or CLI.
2. `compatd` inspects Portable Executable (PE) metadata.
3. Dependency resolver maps required DLL APIs to compatibility runtime.
4. Process is started with a Windows-like environment block and token context.
5. Calls route to Win32 compatibility APIs, native POSIX services, or translation adapters.

## Runtime Layers

- Win32 API compatibility layer (user32, gdi32, kernel32, advapi32, etc.).
- .NET runtime compatibility path:
  - .NET Framework via compatibility runtime.
  - .NET (Core/5+) via native runtime where possible.
- COM support subset for common desktop apps.
- Registry virtualization for app-specific keys and system keys.

## 3. Compatibility Tiers

- Tier A: Win32 productivity apps (highest priority).
- Tier B: .NET desktop apps.
- Tier C: Developer tooling and CLI apps.
- Tier D: Legacy/edge apps and older installers.
- Tier E: Kernel-mode app dependencies (best-effort, often blocked).

## 4. Driver Compatibility Strategy

- Native Linux drivers are default.
- Windows kernel drivers (`.sys`) are not generally executable in Linux kernel space.
- For specific devices lacking native support:
  - Investigate user-space bridges.
  - Provide certified hardware compatibility list.
- Avoid promising blanket Windows driver compatibility.

## 5. Filesystem and Permissions Compatibility

## Filesystem behavior

- Base filesystem: ext4/btrfs for reliability and snapshot support.
- Compatibility features:
  - Case-insensitive per-directory option for Windows app paths.
  - Path canonicalization with Windows semantics.
  - NTFS alternate data streams emulation where required.

## Security model mapping

- Linux UID/GID + POSIX ACL baseline.
- Compatibility ACL layer translating common NTFS ACL operations.
- UAC-like elevation prompts via policy service.

## 6. CLI and Developer Compatibility

- PowerShell:
  - Ship PowerShell 7 as default.
  - Add Windows cmdlet compatibility wrappers where feasible.
- CMD:
  - Provide `cmd` interpreter compatibility subset for common batch workflows.
- Windows Terminal:
  - Build tabbed terminal app with profile support and split panes.
- Package manager:
  - `winget`-style UX backed by native package backend.

## 7. Risks and Mitigations

- Risk: API gaps break enterprise apps.
  - Mitigation: telemetry-backed API coverage roadmap and app certification program.
- Risk: installer incompatibility.
  - Mitigation: app containerized installers + MSI/EXE compatibility harness.
- Risk: user expectation mismatch around drivers.
  - Mitigation: explicit device compatibility matrix before install.
