# MVP Prototype Plan

## 1. MVP Objective

Deliver a usable desktop OS preview that proves:

- `.exe` execution for common productivity apps.
- Familiar Windows-like workflows (shell + terminal + file operations).
- Low-resource performance on 4-8 GB laptops.
- Offline-capable AI assistant for core system tasks.

## 2. MVP Feature Set

## Must-have

- Bootable desktop image.
- File Explorer with tabs and drag/drop.
- Settings app (system, network, privacy, display).
- Terminal with PowerShell 7 profile and CMD compatibility profile.
- Task Manager.
- App Installer with signed package validation.
- Win32 compatibility runtime able to launch selected `.exe` apps.
- AI assistant (text first, voice optional in MVP) for:
  - File search
  - Launch app
  - Change selected settings
  - Basic cleanup recommendations

## Should-have

- Photo viewer/editor basic tools.
- Video player with hardware decode.
- Lightweight browser.
- Snap layouts and virtual desktops.

## 3. MVP App Compatibility Target List

- Notepad++
- 7-Zip
- VS Code
- Git for Windows CLI
- Slack or equivalent collaboration app
- A Chromium-based browser install path

Target: >= 60% successful launch and core-function pass rate for list above.

## 4. Performance Acceptance Criteria

- 8 GB test laptop:
  - Boot to desktop <= 25s
  - Idle RAM <= 2.0 GB
  - Idle CPU <= 3%
- 4 GB test laptop:
  - Boot to desktop <= 35s
  - Responsive shell with no critical OOM during normal use

## 5. Security Acceptance Criteria

- Signed base image verification on boot path.
- App installer blocks unsigned/high-risk packages by policy.
- Sandboxing enforced for browser and media apps.
- Basic malware scan hooks active on downloads and installs.

## 6. MVP Test Plan

- Compatibility regression suite:
  - App install/launch/open/save/exit paths.
- CLI suite:
  - PowerShell scripts, CMD batch files, terminal profile behavior.
- UX suite:
  - Snap, notifications, settings search, explorer drag/drop.
- Resource suite:
  - Boot time, idle metrics, thermal and battery checks.

## 7. Demo Narrative

- Install OS on 8 GB laptop.
- Open File Explorer + tabs + search.
- Install and run 2-3 Windows `.exe` apps.
- Run PowerShell and CMD commands in terminal.
- Use AI assistant to change a setting and locate files.
- Show glass UI, snap layout, and accessibility toggle.
