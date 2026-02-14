# OS Architecture Plan

## 1. Architectural Principles

- Compatibility-first: preserve Windows app/workflow behavior before adding novel features.
- Modular isolation: split system into replaceable services with stable IPC contracts.
- Low-resource operation: memory ceilings and idle CPU budgets are first-class non-functional requirements.
- Local-first intelligence: AI features must operate without cloud dependency.
- Defense in depth: least privilege, sandboxing, signed updates, auditable security policy.

## 2. High-Level System Layout

## Hardware + Firmware Layer

- UEFI boot support (Secure Boot compatible path).
- ACPI power management for laptops.
- GPU acceleration through native Linux graphics stack.

## Core OS Layer

- Linux LTS kernel (baseline for driver support and hardware reach).
- systemd-based service orchestration (or equivalent process manager).
- Compatibility system services for Win32 APIs and Windows behavior shims.

## Platform Services Layer

- Identity and permissions service (Windows-like accounts/groups + ACL mapping).
- Virtual registry service (Windows registry-compatible interfaces).
- File compatibility service (NTFS semantics emulation where practical).
- Update service (transactional, rollback-capable).
- Security services (Defender-style scanning engine + policy enforcement).

## User Experience Layer

- Desktop shell (taskbar/start launcher/notifications/quick settings).
- Window manager + compositor with glass blur and snap layouts.
- Core first-party app suite.

## Developer + App Layer

- Win32/.NET app runtime compatibility.
- PowerShell + CMD + terminal compatibility tools.
- Native SDK/API set for OS-specific apps.

## 3. Subsystem Boundaries

## Process and IPC Model

- D-Bus for control-plane messaging.
- gRPC/Unix sockets for high-throughput service APIs.
- Strict service identities and permissions for each subsystem.

## Key Services

- `compatd`: manages PE loading flow and API compatibility routing.
- `regd`: virtual Windows registry backend with policy overlays.
- `fsd`: filesystem behavior compatibility (case-insensitive views, ADS emulation strategy).
- `acctd`: local/domain account handling and token mapping.
- `defenderd`: malware scanning, quarantine, scheduled scans.
- `updated`: staged update installation and rollback.
- `aid`: on-device AI orchestration and intent execution.

## 4. Windows Feature Parity Targets (Windows 11)

- Snap layouts and snap groups.
- Virtual desktops and task view.
- Clipboard history and cloud clipboard option.
- Notifications center and quick actions.
- Widgets-like panel (optional in MVP).
- Windows Terminal-like tabbed terminal UX.
- Settings app parity for common device/network/user/privacy workflows.

## 5. Resource Budgets (Low-End Laptops)

Target profile: 2C/4T CPU, SATA SSD, 4-8 GB RAM.

- Idle RAM target (fresh boot): 1.2-1.8 GB.
- Idle CPU target: <2% average on balanced power profile.
- Cold boot target: <20 seconds to interactive desktop on SSD.
- Background services budget: max 25 always-on services in MVP.

## 6. Deployment Model

- Immutable base image + writable user/application layers.
- A/B system partition updates for fail-safe rollback.
- Signed package channels:
  - Stable (default)
  - Insider (preview)
  - LTS enterprise channel

## 7. Compatibility Governance

- Compatibility scorecard per release:
  - App launch success
  - API coverage
  - Install success rate
  - Crash rate
- Golden app test list:
  - Office tools, browsers, collaboration apps, developer tools, utility apps.
