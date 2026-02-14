#!/usr/bin/env bash
set -euo pipefail

run_app_case() {
  local case_id="$1"
  local launch_cmd="$2"
  local required="$3"
  local timeout_seconds="${APP_TIMEOUT_SECONDS:-20}"

  # Real launcher hook: executes command with timeout and captures output for triage.
  # In host environments without target apps installed, failures are recorded as BLOCKED.
  if command -v timeout >/dev/null 2>&1; then
    if output=$(timeout "$timeout_seconds" sh -c "$launch_cmd" 2>&1); then
      record_result "$case_id" "PASS" "$required" "Launch command succeeded"
    else
      if [[ "$output" == *"not found"* || "$output" == *"No such file"* ]]; then
        record_result "$case_id" "BLOCKED" "$required" "App/runtime missing: $output"
      else
        record_result "$case_id" "FAIL" "$required" "Launch command failed: $output"
      fi
    fi
  else
    # macOS fallback where GNU timeout is often absent.
    if output=$(sh -c "$launch_cmd" 2>&1); then
      record_result "$case_id" "PASS" "$required" "Launch command succeeded"
    else
      if [[ "$output" == *"not found"* || "$output" == *"No such file"* ]]; then
        record_result "$case_id" "BLOCKED" "$required" "App/runtime missing: $output"
      else
        record_result "$case_id" "FAIL" "$required" "Launch command failed: $output"
      fi
    fi
  fi
}
