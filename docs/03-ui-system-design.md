# UI System Design

## 1. Visual Direction

Design goals:

- Fluent, translucent, glass-like visual language.
- High legibility on low-quality displays.
- GPU-efficient blur and animation paths.

## Core style primitives

- Backdrop blur surfaces with layered translucency.
- Rounded window corners and soft shadows.
- Subtle depth separation (z-layers).
- Motion system with short easing curves and consistent durations.

## 2. Rendering Stack

- Compositor: Wayland-based compositor with blur shader pipeline.
- Toolkit recommendation:
  - Shell: Rust + GTK4/libadwaita customization or Qt6/QML with GPU acceleration.
  - First-party apps: shared design system components.
- Fallback mode:
  - Disable live blur on low-end GPUs.
  - Replace with noise-tinted translucent panels.

## 3. Design Tokens (Example)

- `surface/glass/base`: rgba(245, 248, 255, 0.60)
- `surface/glass/dark`: rgba(28, 32, 40, 0.58)
- `surface/border`: rgba(255, 255, 255, 0.20)
- `text/primary/light`: #10131A
- `text/primary/dark`: #F4F6FB
- `radius/window`: 14px
- `motion/fast`: 120ms
- `motion/standard`: 180ms

## 4. Shell Components

- Taskbar:
  - Center/left alignment option.
  - App pinning, quick launch, system tray.
- Start launcher:
  - Search-first app and file entry.
  - Recommended documents and recent apps.
- Notification center + quick settings:
  - Wi-Fi, Bluetooth, brightness, power modes, accessibility toggles.
- File Explorer with tabs and preview pane.
- Snap layouts:
  - Hover affordance on maximize action.
  - Keyboard snap shortcuts and drag zones.

## 5. Built-In App UX Requirements

- File Explorer: tabs, breadcrumb path bar, indexed search, cloud locations.
- Video Player: hardware decode, subtitle support, low-power playback mode.
- Photo Viewer/Editor: nondestructive edits, crop, rotate, color presets.
- Text/Code Editor: syntax highlighting, fast open, large file support.
- Settings: searchable, category-based, policy-aware controls.
- Terminal + PowerShell: tabs, profiles, font and color presets.
- Task Manager: process/resource/startup panels.
- App Installer: signed package checks and permission prompts.
- Browser (lightweight): Chromium/WebKit-based minimal shell.

## 6. Accessibility

- Screen reader hooks and full keyboard navigation.
- High contrast themes and color filters.
- Dynamic text scaling with layout reflow.
- Motion reduction option and animation disable mode.
- Voice control support for shell navigation.

## 7. Tablet and Input Modes

- Touch targets >= 40x40 px in tablet mode.
- On-screen keyboard with split/floating layout.
- Gesture support for task switcher and notifications.
- Auto mode switch based on keyboard dock state.
