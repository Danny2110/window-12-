# Full Replacement OS Architecture (Non-Ubuntu)

## Reality and Delivery Model

A complete Windows 10/11 replacement requires multiple years. This design defines a real full-stack program with an installable OS target, not a theme layer.

Product name: `AsterOS` (working name)

Base choice:

- Not Ubuntu-based.
- Use independent Linux LTS kernel + custom userland distribution pipeline.
- Bootable installer ISO + signed update channels.

## 1. System Core

Kernel strategy:

- Modified Linux LTS kernel with Aster patches:
  - Scheduler tuning profiles for low-end CPUs.
  - Memory pressure and OOM policy tuned for 4-8 GB RAM.
  - Fast boot and service parallelization policy.

Core subsystems:

- Process scheduler: CFS baseline + desktop-interactive tuning.
- Memory management: zram default on low-memory devices, page cache balancing.
- Driver architecture: kernel drivers + user-space service drivers.
- HAL: uniform APIs for power, display, input, network, storage, audio.
- Filesystem: ext4/btrfs base + NTFS-compatible behavior layer in user space.
- Permissions: SID-like identity mapping over POSIX accounts and ACL translation.

## 2. Windows Compatibility

Executable support:

- `.exe` and `.msi` via compatibility subsystem (`compatd`) and PE loader.
- MSI installation pipeline with registry + filesystem virtualization.

API compatibility:

- Win32 API coverage prioritization:
  - kernel32/user32/gdi32/advapi32 first.
  - COM and .NET interop second.
- Registry-compatible service (`regd`): HKLM/HKCU views and policy overlay.
- DirectX support via translation path (DXVK/VKD3D style strategy).
- Game compatibility mode:
  - Fullscreen, controller input, shader cache, anti-cheat compatibility matrix.

## 3. Desktop Environment

Shell features:

- Windows-like taskbar, Start with indexed search, tray, notifications.
- Snap layouts, virtual desktops, lock screen, multi-monitor.
- Accessibility: high contrast, narrator hooks, keyboard navigation, scaling.
- Dark/light themes with acrylic-style blur.

## 4. Built-in Core Apps (Native)

- File Explorer
- Video Player
- Photo Viewer + basic Editor
- Text + Code Editor
- Settings
- Terminal
- PowerShell-compatible shell
- Task Manager
- Disk Manager
- Device Manager
- App Installer / Store
- Backup & Restore
- Browser

## 5. Terminal and Developer Support

- CMD-like command compatibility layer.
- PowerShell 7 integration + compatibility modules.
- Package manager: `apkg` (native) + winget-style manifest bridge.
- SDK for app packaging, shell integration, permissions, notifications.

## 6. AI Integration

- OS service: `aid` (local-first).
- Voice + text assistant.
- Allowed actions: launch apps, change settings, file search, diagnostics.
- Offline model packs (quantized small models).
- Automation engine with permission prompts and audit logs.

## 7. Performance Targets

Target hardware: 2C/4T CPUs, 4-8 GB RAM.

- Cold boot < 25s (SSD)
- Idle RAM 1.5-2.2 GB
- Idle CPU < 3%
- Background services kept under hard budget
- GPU fallback path for weak integrated GPUs

## 8. Hardware Support

- Wi-Fi, Bluetooth, USB HID/storage, printers, webcams, audio.
- Driver policy:
  - Native Linux drivers primary.
  - Device certification matrix published per release.

## 9. Installability

- Graphical installer with safe partitioning and recovery partition.
- UEFI + Secure Boot path.
- A/B system updates with rollback.

