#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
source "$ROOT_DIR/testing/harness/lib/common.sh"
source "$ROOT_DIR/testing/harness/scenarios/cli.sh"
source "$ROOT_DIR/testing/harness/scenarios/apps.sh"

APPS_MATRIX="$ROOT_DIR/testing/matrix/apps-tier-a.csv"
CLI_MATRIX="$ROOT_DIR/testing/matrix/cli-compat.csv"

while IFS=, read -r case_id _tier _app _installer launch_command required _owner _notes; do
  [[ "$case_id" == "case_id" ]] && continue
  run_app_case "$case_id" "$launch_command" "$required"
done < "$APPS_MATRIX"

while IFS=, read -r case_id _shell command expected required _owner; do
  [[ "$case_id" == "case_id" ]] && continue
  run_cli_case "$case_id" "$command" "$expected" "$required"
done < "$CLI_MATRIX"

pass_count=$(grep -c ',PASS,' "$CSV_OUT" || true)
fail_count=$(grep -c ',FAIL,' "$CSV_OUT" || true)
blocked_count=$(grep -c ',BLOCKED,' "$CSV_OUT" || true)
required_fail=$(awk -F',' '$2 == "FAIL" && $3 == "true" {count++} END {print count+0}' "$CSV_OUT")

cat > "$JSON_OUT" <<JSON
{
  "timestamp": "$TIMESTAMP",
  "pass": $pass_count,
  "fail": $fail_count,
  "blocked": $blocked_count,
  "required_fail": $required_fail,
  "csv": "$CSV_OUT"
}
JSON

echo "Results CSV: $CSV_OUT"
echo "Summary JSON: $JSON_OUT"

if [[ "$required_fail" -gt 0 ]]; then
  echo "Required-case failures detected"
  exit 1
fi

echo "Harness completed"
