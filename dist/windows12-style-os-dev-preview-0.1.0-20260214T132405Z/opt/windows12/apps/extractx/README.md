# ExtractX

A built-in extraction app for `Windows 12-style OS`.

## Formats

- Native: `.zip`, `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.tbz2`, `.tar.xz`, `.txz`
- External tool fallback: `.rar`, `.7z`

Fallback tools searched automatically:

- `7z`
- `unar`
- `unrar`
- `bsdtar`

## Run

```bash
cd /Users/soares10/windows12-style-os
python3 apps/extractx/extractx.py
```

## UI

- Frosted dark-glass card layout
- Single-click file/destination selection
- Status messaging and actionable error output

## Integration target

- Register this app as default archive handler in OS shell.
- Expose `Extract Here` and `Extract To...` context-menu actions in File Explorer.
