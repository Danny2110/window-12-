# Browser and App Stack Design

## First-Party Browser: Aster Browser

Architecture:

- Multi-process model:
  - UI process
  - network process
  - isolated renderer processes per site group
  - extension process sandbox
- GPU compositing with low-memory fallback.

Security model:

- Per-tab sandbox with strict IPC policy.
- HTTPS upgrade by default.
- Built-in tracker and ad blocking.
- URL reputation checks and safe-download scanning.
- Local encrypted credential vault.

Feature model:

- Tab groups, vertical tabs, workspaces.
- Reader mode, screenshots, download manager.
- WebExtensions-compatible API surface.
- Integrated developer tools and network inspector.
- Sync (optional), offline-first reading cache.

AI in browser:

- Local-first assistant actions:
  - page summarization
  - rewrite and tone transform
  - code assistance
  - voice browsing commands
- Permission-gated action policy and audit log.

## Core App Program

All required app categories are tracked in `os/apps/core-app-catalog.yaml`.

Implementation policy:

- Native apps for shell coherence and performance.
- Shared UI component system for accessibility and consistency.
- Strict startup budgets to support 4-8 GB machines.

