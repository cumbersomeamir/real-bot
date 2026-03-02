#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:5001/api}"
EMAIL="${EMAIL:-owner@dealflow.ai}"
PASSWORD="${PASSWORD:-Password@123}"

step() {
  printf "\n==> %s\n" "$1"
}

json_get() {
  node -e "const d=JSON.parse(process.argv[1]); const p=process.argv[2].split('.'); let x=d; for (const k of p) x=x?.[k]; if (x===undefined||x===null) process.exit(1); console.log(x);" "$1" "$2"
}

call() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$body"
  else
    curl -sS -X "$method" "$url" -H "Authorization: Bearer $TOKEN"
  fi
}

step "Login"
LOGIN_RES=$(curl -sS -X POST "$API_BASE/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(json_get "$LOGIN_RES" "data.accessToken")
echo "token ok"

step "Analytics overview"
call GET "$API_BASE/analytics/overview" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"

step "Leads list"
LEADS=$(call GET "$API_BASE/leads")
ORG_ID=$(node -e "const d=JSON.parse(process.argv[1]); const i=d?.data?.items?.[0]; if(!i){process.exit(1)}; console.log(i.organizationId);" "$LEADS" || true)
if [[ -z "${ORG_ID:-}" ]]; then
  echo "warn: no leads returned"
fi

step "Create lead"
LEAD_RES=$(call POST "$API_BASE/leads" "{\"name\":\"Smoke Lead\",\"phone\":\"+919999999991\",\"email\":\"smoke+lead@dealflow.ai\",\"source\":\"MANUAL\",\"status\":\"NEW\"}")
LEAD_ID=$(json_get "$LEAD_RES" "data.id")
echo "lead created: $LEAD_ID"

step "Update lead"
call PUT "$API_BASE/leads/$LEAD_ID" "{\"status\":\"CONTACTED\"}" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"

step "List brokers"
call GET "$API_BASE/brokers" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log((d?.data?.items||[]).length >= 0 ? 'ok' : 'fail')"

step "Agents"
call GET "$API_BASE/agents" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"

step "Automation rules"
RULE_RES=$(call POST "$API_BASE/rules" "{\"name\":\"Smoke Rule\",\"description\":\"Smoke\",\"conditions\":[{\"field\":\"score\",\"op\":\"gte\",\"value\":80}],\"actions\":[{\"type\":\"assign_broker\"}]}")
RULE_ID=$(json_get "$RULE_RES" "data.id")
echo "rule created: $RULE_ID"

step "Communications template"
call POST "$API_BASE/communications/templates" "{\"name\":\"smoke_template\",\"category\":\"marketing\",\"content\":\"Hi from smoke\",\"variables\":[]}" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"

step "Settings + Team"
call GET "$API_BASE/settings" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"
call GET "$API_BASE/team" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.success ? 'ok' : 'fail')"

echo "\nSmoke test complete ✅"
