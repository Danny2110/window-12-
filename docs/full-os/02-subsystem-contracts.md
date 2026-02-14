# Subsystem Contracts

## Kernel/HAL boundary

- HAL exports stable capability APIs:
  - `hal.display.*`
  - `hal.input.*`
  - `hal.power.*`
  - `hal.net.*`
  - `hal.audio.*`
  - `hal.storage.*`

## Compatibility services

- `compatd`: process launch broker for PE binaries.
- `regd`: registry-compatible store and policy overlays.
- `fsd`: NTFS behavior emulation (path rules, case handling, ADS compatibility strategy).
- `gamed`: game runtime profile manager (graphics translation + controller mapping).

## Desktop shell contracts

- `shelld`: taskbar/start/notifications/snap orchestration.
- `searchd`: app/file/settings index service.
- `sessiond`: lock screen, desktop session lifecycle, multi-monitor state.

## Security contracts

- `defenderd`: malware scanning hooks and quarantine workflow.
- `policyd`: permissions, elevation, sandbox profile selection.
- `vaultd`: key and encryption service.

## AI contracts

- `aid`: intent parsing, action planning, policy-aware execution.
- `aid` never applies privileged changes without explicit user confirmation unless policy allows.

## Update contracts

- `updated`: channel selection, staged install, apply, rollback.
- atomic boot slot switch with health check gate.

