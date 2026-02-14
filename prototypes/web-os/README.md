# Windows 12-style OS Web Preview

This is a browser-testable desktop preview that simulates:

- Glass/translucent shell UX
- File Explorer workflow
- Terminal workflow with PowerShell/CMD-like commands
- AI assistant interaction flow
- ExtractX archive workflow
- Task View and virtual desktops
- File Explorer sidebar/search/context menu actions
- Real browser-side `.zip` extraction into a persisted virtual filesystem

## Run locally

```bash
cd /Users/soares10/windows12-style-os/prototypes/web-os
python3 -m http.server 8080
```

Then open:

- http://localhost:8080

## Important limits

- Browser preview cannot run native `.exe`, drivers, or real kernel services.
- This is UX + workflow validation only.
- Native compatibility is implemented in OS runtime artifacts, not browser JavaScript.
