# Required Languages, Frameworks, and Tooling

## 1. Systems and Core Services

- Rust:
  - Recommended for new OS daemons (`compatd`, `updated`, `aid`, policy services).
  - Memory safety and strong concurrency model.
- C/C++:
  - Required for low-level compatibility interfaces and selected legacy integration points.
- Bash + Python:
  - Build tooling, packaging scripts, and test orchestration.

## 2. UI and Shell

- Primary options:
  - Qt 6/QML (high-performance compositor-friendly desktop shell).
  - GTK4/libadwaita (if team has GNOME stack expertise).
- Rendering:
  - Wayland compositor and GPU shaders for blur/transparency.
- UX component system:
  - Shared design tokens and reusable shell widgets.

## 3. Compatibility and Developer Tools

- Win32 compatibility runtime (integration-based approach).
- PowerShell 7 runtime package.
- Terminal frontend with PTY integration.
- Package manager backend:
  - Native package format + optional compatibility bridge for winget-style manifests.

## 4. AI Stack

- Inference runtime:
  - ONNX Runtime or llama.cpp for local model execution.
- Model classes:
  - Small local LLM for assistant routing (3B-8B quantized).
  - ASR model for voice input (optional MVP+).
  - Intent classifiers and retrieval index for file/settings actions.
- Safety:
  - Action policy engine requiring confirmation for privileged operations.

## 5. Storage and Data

- Filesystem: btrfs (snapshots) or ext4 + snapshot tooling.
- Indexed search:
  - Local indexer daemon with incremental updates.
- Settings/config:
  - Structured config store with policy overlays and audit logs.

## 6. Build, CI/CD, and Validation

- Build system:
  - CMake/Meson for native components.
  - Cargo for Rust services.
- CI:
  - GitHub Actions/GitLab CI with matrix builds.
- Testing:
  - Integration tests in VM and bare-metal test farms.
  - Performance benchmarks on low-end reference devices.

## 7. SDK and App Developer API

Expose stable APIs for:

- Windowing and notifications.
- File picker and permission grants.
- AI assistant intents (opt-in with user consent).
- Package install/update lifecycle hooks.

SDK components:

- CLI dev tools.
- App manifest schema.
- Simulator/VM test image.
- Documentation and compatibility guides.
