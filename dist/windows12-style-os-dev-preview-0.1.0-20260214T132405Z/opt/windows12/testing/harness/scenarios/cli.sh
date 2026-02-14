#!/usr/bin/env bash
set -euo pipefail

run_cli_case() {
  local case_id="$1"
  local command="$2"
  local expected="$3"
  local required="$4"

  if output=$(eval "$command" 2>&1); then
    if [[ -z "$expected" || "$output" == *"$expected"* ]]; then
      record_result "$case_id" "PASS" "$required" "Matched expected output"
    else
      record_result "$case_id" "FAIL" "$required" "Output mismatch: $output"
    fi
  else
    record_result "$case_id" "BLOCKED" "$required" "Command unavailable or failed"
  fi
}
