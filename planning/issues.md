# Implementation Backlog (Executable)

## Sprint 0 (2 weeks): Foundations

ID: W12-0001
Title: Build and release pipeline bootstrap
Owner: Platform
Estimate: 5d
Dependencies: None
Acceptance Criteria:
- Reproducible build job for OS image, Rust workspace, and docs.
- Signed artifacts generated for internal channel.
- Build metadata (commit, date, artifact hash) published.

ID: W12-0002
Title: Reference hardware + benchmark harness
Owner: Performance
Estimate: 3d
Dependencies: W12-0001
Acceptance Criteria:
- Benchmark script collects boot time, idle RAM, idle CPU.
- Results persisted in `testing/results/` with timestamped JSON.

ID: W12-0003
Title: Compatibility matrix seed
Owner: Compatibility
Estimate: 2d
Dependencies: None
Acceptance Criteria:
- Top 25 apps/workflows entered into matrix with owner + priority.
- Pass/fail rubric documented.

## Sprint 1 (2 weeks): Daemon + contract skeleton

ID: W12-0101
Title: Shared IPC contract crate
Owner: Core Runtime
Estimate: 3d
Dependencies: W12-0001
Acceptance Criteria:
- `platform-contracts` crate defines typed requests/responses for `compatd`, `updated`, `aid`.
- Versioned service names and health contract included.

ID: W12-0102
Title: `compatd` daemon skeleton
Owner: Compatibility
Estimate: 3d
Dependencies: W12-0101
Acceptance Criteria:
- Service exposes health and launch-plan endpoints (stubbed).
- Structured logs and deterministic exit codes.

ID: W12-0103
Title: `updated` daemon skeleton
Owner: Platform
Estimate: 3d
Dependencies: W12-0101
Acceptance Criteria:
- Service exposes channels, check, stage, apply, rollback endpoints (stubbed).
- State transitions validate allowed flows.

ID: W12-0104
Title: `aid` daemon skeleton
Owner: AI Platform
Estimate: 4d
Dependencies: W12-0101
Acceptance Criteria:
- Service exposes intent parse + execute endpoint (stubbed).
- Risk policy gate requires confirmation for privileged intents.

## Sprint 2 (2 weeks): Harness automation

ID: W12-0201
Title: Compatibility harness CLI
Owner: QA Automation
Estimate: 4d
Dependencies: W12-0003
Acceptance Criteria:
- Harness executes matrix scenarios and emits CSV + JSON summary.
- Exit status non-zero on required-case regressions.

ID: W12-0202
Title: CLI compatibility suite (PowerShell/CMD/Terminal)
Owner: Developer Experience
Estimate: 3d
Dependencies: W12-0201
Acceptance Criteria:
- Scripts validate command semantics and encoding behavior.
- Baseline result snapshots checked in.

ID: W12-0203
Title: App install/launch smoke suite
Owner: Compatibility
Estimate: 3d
Dependencies: W12-0201
Acceptance Criteria:
- Installer and launch workflows scripted for top 10 apps.
- Failure artifacts (logs/screenshots) captured.

## Sprint 3 (2 weeks): MVP integration

ID: W12-0301
Title: Wire shell actions to `aid` intents
Owner: Shell + AI
Estimate: 4d
Dependencies: W12-0104
Acceptance Criteria:
- File search and settings-change intents callable from shell UI.
- User confirmation step enforced for risky actions.

ID: W12-0302
Title: `compatd` executable pilot set
Owner: Compatibility
Estimate: 5d
Dependencies: W12-0102
Acceptance Criteria:
- At least 5 Tier A apps launch to primary window.
- Known API gaps logged with stack traces and issue links.

ID: W12-0303
Title: Performance target check on 8 GB hardware
Owner: Performance
Estimate: 3d
Dependencies: W12-0302
Acceptance Criteria:
- Idle RAM <= 2.0 GB on reference image.
- Idle CPU <= 3% with baseline services enabled.

## Definition of Done (all backlog items)

- Test evidence linked.
- Rollback path documented.
- Security review note attached.
- Owner signs off acceptance criteria.
