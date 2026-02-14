# Compatibility Matrix

## Files

- `apps-tier-a.csv`: Tier A app install/launch coverage.
- `cli-compat.csv`: PowerShell/CMD/terminal workflow compatibility checks.
- `APP-007` in `apps-tier-a.csv`: built-in `ExtractX` archive smoke scenario.

## Status rules

- `PASS`: expected behavior matched.
- `FAIL`: expected behavior did not match.
- `BLOCKED`: environment prerequisite missing.

App scenario behavior:

- App cases execute the matrix launch command directly.
- If runtime/app is missing, case is marked `BLOCKED`.
- Non-missing execution errors are marked `FAIL`.

## Required-case policy

Harness exits non-zero when any required case fails.
