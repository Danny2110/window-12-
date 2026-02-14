#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
RESULTS_DIR="$ROOT_DIR/testing/results"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR="$RESULTS_DIR/$TIMESTAMP"
CSV_OUT="$RUN_DIR/results.csv"
JSON_OUT="$RUN_DIR/summary.json"

mkdir -p "$RUN_DIR"

echo "case_id,status,required,details" > "$CSV_OUT"

record_result() {
  local case_id="$1"
  local status="$2"
  local required="$3"
  local details="$4"
  printf '%s,%s,%s,%q\n' "$case_id" "$status" "$required" "$details" >> "$CSV_OUT"
}
