#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:5001/api}"
APP_BASE="${APP_BASE:-http://localhost:3000}"
EMAIL="${EMAIL:-owner@dealflow.ai}"
PASSWORD="${PASSWORD:-Password@123}"
REQUEST_DELAY="${REQUEST_DELAY:-0.7}"

PASS_COUNT=0
FAIL_COUNT=0

log() {
  printf "%s\n" "$1"
}

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  printf "  [OK] %s\n" "$1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  printf "  [FAIL] %s\n" "$1"
}

json_get() {
  node -e "const d=JSON.parse(process.argv[1]); const p=process.argv[2].split('.'); let x=d; for (const k of p) x=x?.[k]; if (x===undefined||x===null) process.exit(1); process.stdout.write(String(x));" "$1" "$2"
}

assert_success() {
  node -e "const d=JSON.parse(process.argv[1]); if (!d.success) process.exit(1);" "$1"
}

assert_not_implemented() {
  node -e "const d=JSON.parse(process.argv[1]); if (d.status !== 'not_implemented') process.exit(1);" "$1"
}

request_api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local out
  if [[ -n "${TOKEN:-}" && -n "$body" ]]; then
    out="$(curl -sS -w $'\n%{http_code}' -X "$method" "$API_BASE$path" \
      -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$body")"
  elif [[ -n "${TOKEN:-}" ]]; then
    out="$(curl -sS -w $'\n%{http_code}' -X "$method" "$API_BASE$path" \
      -H "Authorization: Bearer $TOKEN")"
  elif [[ -n "$body" ]]; then
    out="$(curl -sS -w $'\n%{http_code}' -X "$method" "$API_BASE$path" \
      -H "Content-Type: application/json" -d "$body")"
  else
    out="$(curl -sS -w $'\n%{http_code}' -X "$method" "$API_BASE$path")"
  fi
  printf "%s" "$out"
  sleep "$REQUEST_DELAY"
}

call_success() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local expected="${4:-200}"
  local raw code resp
  raw="$(request_api "$method" "$path" "$body")"
  code="$(printf "%s" "$raw" | tail -n 1)"
  resp="$(printf "%s" "$raw" | sed '$d')"

  if [[ ",$expected," != *",$code,"* ]]; then
    fail "$method $path (expected $expected, got $code)"
    return 1
  fi
  if assert_success "$resp"; then
    pass "$method $path"
  else
    fail "$method $path (success=false)"
    return 1
  fi
}

call_not_implemented() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local raw code resp
  raw="$(request_api "$method" "$path" "$body")"
  code="$(printf "%s" "$raw" | tail -n 1)"
  resp="$(printf "%s" "$raw" | sed '$d')"
  if [[ "$code" != "501" ]]; then
    fail "$method $path (expected 501, got $code)"
    return 1
  fi
  if assert_not_implemented "$resp"; then
    pass "$method $path"
  else
    fail "$method $path (unexpected payload)"
    return 1
  fi
}

call_page() {
  local path="$1"
  local expected="${2:-200}"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" "$APP_BASE$path")"
  sleep "$REQUEST_DELAY"
  if [[ ",$expected," == *",$code,"* ]]; then
    pass "PAGE $path"
  else
    fail "PAGE $path (expected $expected, got $code)"
    return 1
  fi
}

run() {
  log ""
  log "== Frontend Pages =="
  call_page "/"
  call_page "/features"
  call_page "/pricing"
  call_page "/how-it-works"
  call_page "/case-studies"
  call_page "/audit"
  call_page "/blog"
  call_page "/contact"
  call_page "/about"
  call_page "/integrations"
  call_page "/privacy"
  call_page "/terms"
  call_page "/login"
  call_page "/dashboard" "307,308"

  log ""
  log "== Auth =="
  local login_raw login_code login_json
  login_raw="$(request_api "POST" "/auth/login" "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
  login_code="$(printf "%s" "$login_raw" | tail -n 1)"
  login_json="$(printf "%s" "$login_raw" | sed '$d')"
  if [[ "$login_code" != "200" ]]; then
    fail "POST /auth/login (expected 200, got $login_code)"
    return 1
  fi
  assert_success "$login_json"
  TOKEN="$(json_get "$login_json" "data.accessToken")"
  REFRESH_TOKEN="$(json_get "$login_json" "data.refreshToken")"
  pass "POST /auth/login"

  call_success "GET" "/auth/me"
  call_success "POST" "/auth/refresh" "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
  call_success "POST" "/auth/forgot-password" "{\"email\":\"$EMAIL\"}"
  call_success "POST" "/auth/reset-password" "{\"token\":\"dummy\",\"password\":\"Password@123\"}"

  log ""
  log "== Leads =="
  call_success "GET" "/leads"
  local leads_resp lead_id
  leads_resp="$(request_api "GET" "/leads")"
  lead_id="$(printf "%s" "$leads_resp" | sed '$d' | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); const id=d?.data?.items?.[0]?.id; if (!id) process.exit(1); process.stdout.write(id);")"

  call_success "GET" "/leads/$lead_id"
  local new_phone
  new_phone="+9198$RANDOM$RANDOM"
  local create_lead_raw create_lead_json new_lead_id
  create_lead_raw="$(request_api "POST" "/leads" "{\"name\":\"Capability Lead\",\"phone\":\"$new_phone\",\"email\":\"capability+$RANDOM@dealflow.ai\",\"source\":\"MANUAL\",\"status\":\"NEW\"}")"
  create_lead_json="$(printf "%s" "$create_lead_raw" | sed '$d')"
  if [[ "$(printf "%s" "$create_lead_raw" | tail -n 1)" != "201" ]]; then
    fail "POST /leads"
    return 1
  fi
  assert_success "$create_lead_json"
  new_lead_id="$(json_get "$create_lead_json" "data.id")"
  pass "POST /leads"

  call_success "PUT" "/leads/$new_lead_id" "{\"status\":\"CONTACTED\"}"
  call_success "POST" "/leads/$new_lead_id/score" "{}"
  call_success "POST" "/leads/$new_lead_id/qualify" "{}"
  call_success "GET" "/leads/$new_lead_id/timeline"
  call_success "GET" "/leads/$new_lead_id/communications"
  call_success "POST" "/leads/import" "{}"
  call_success "POST" "/leads/bulk-action" "{\"ids\":[\"$new_lead_id\"],\"status\":\"WARM\"}"

  log ""
  log "== Brokers =="
  call_success "GET" "/brokers"
  call_success "GET" "/brokers/leaderboard"
  local brokers_resp broker_id
  brokers_resp="$(request_api "GET" "/brokers")"
  broker_id="$(printf "%s" "$brokers_resp" | sed '$d' | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); const id=d?.data?.items?.[0]?.id; if (!id) process.exit(1); process.stdout.write(id);")"
  call_success "POST" "/leads/$new_lead_id/assign" "{\"brokerId\":\"$broker_id\"}"
  call_success "GET" "/brokers/$broker_id"
  call_success "GET" "/brokers/$broker_id/leads"
  call_success "GET" "/brokers/$broker_id/performance"

  log ""
  log "== Projects =="
  call_success "GET" "/projects"
  local projects_resp project_id
  projects_resp="$(request_api "GET" "/projects")"
  project_id="$(printf "%s" "$projects_resp" | sed '$d' | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); const id=d?.data?.items?.[0]?.id; if (!id) process.exit(1); process.stdout.write(id);")"
  call_success "GET" "/projects/$project_id"
  call_success "GET" "/projects/$project_id/inventory"
  call_success "PUT" "/projects/$project_id" "{\"status\":\"ACTIVE\"}"

  local create_project_raw create_project_json new_project_id
  create_project_raw="$(request_api "POST" "/projects" "{\"name\":\"Capability Project $RANDOM\",\"location\":\"Whitefield\",\"city\":\"Bangalore\",\"type\":\"RESIDENTIAL\",\"status\":\"ACTIVE\",\"description\":\"Capability test project\",\"totalUnits\":20,\"availableUnits\":20,\"priceRange\":{\"min\":4500000,\"max\":9000000,\"unit\":\"total\"},\"configurations\":[\"2BHK\",\"3BHK\"],\"amenities\":[\"Gym\",\"Clubhouse\"],\"images\":[]}")"
  create_project_json="$(printf "%s" "$create_project_raw" | sed '$d')"
  if [[ "$(printf "%s" "$create_project_raw" | tail -n 1)" != "201" ]]; then
    fail "POST /projects"
    return 1
  fi
  assert_success "$create_project_json"
  new_project_id="$(json_get "$create_project_json" "data.id")"
  pass "POST /projects"

  local inv_resp unit_id
  inv_resp="$(request_api "GET" "/projects/$project_id/inventory")"
  unit_id="$(printf "%s" "$inv_resp" | sed '$d' | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); const id=d?.data?.items?.[0]?.id; if (id) process.stdout.write(id);")" || true
  if [[ -n "$unit_id" ]]; then
    call_success "PUT" "/projects/$project_id/inventory/$unit_id" "{\"status\":\"HOLD\"}"
  else
    pass "PUT /projects/:id/inventory/:unitId (skipped, no inventory unit found)"
  fi

  log ""
  log "== Analytics =="
  call_success "GET" "/analytics/overview"
  call_success "GET" "/analytics/funnel"
  call_success "GET" "/analytics/revenue"
  call_success "GET" "/analytics/campaigns"
  call_success "GET" "/analytics/sources"
  call_success "GET" "/analytics/brokers"
  call_success "GET" "/analytics/forecast"
  call_success "GET" "/analytics/leakage"

  log ""
  log "== AI Agents =="
  call_success "GET" "/agents"
  call_success "GET" "/agents/qualification"
  call_success "PUT" "/agents/qualification/config" "{\"thresholds\":{\"hot\":82,\"warm\":52}}"
  call_success "POST" "/agents/qualification/toggle" "{\"active\":true}"
  call_success "GET" "/agents/qualification/logs"
  call_success "POST" "/agents/qualification/run/$new_lead_id" "{}"
  call_success "POST" "/agents/reactivation/campaign" "{\"name\":\"Capability Reactivation\"}"

  log ""
  log "== Automation Rules =="
  call_success "GET" "/rules"
  local create_rule_raw create_rule_json rule_id
  create_rule_raw="$(request_api "POST" "/rules" "{\"name\":\"Capability Rule $RANDOM\",\"description\":\"Rule capability test\",\"conditions\":[{\"field\":\"score\",\"op\":\"gte\",\"value\":80}],\"actions\":[{\"type\":\"assign_broker\",\"value\":\"$broker_id\"}]}")"
  create_rule_json="$(printf "%s" "$create_rule_raw" | sed '$d')"
  if [[ "$(printf "%s" "$create_rule_raw" | tail -n 1)" != "201" ]]; then
    fail "POST /rules"
    return 1
  fi
  assert_success "$create_rule_json"
  rule_id="$(json_get "$create_rule_json" "data.id")"
  pass "POST /rules"
  call_success "PUT" "/rules/$rule_id" "{\"name\":\"Capability Rule Updated\"}"
  call_success "POST" "/rules/$rule_id/test" "{\"leadId\":\"$new_lead_id\"}"
  call_success "GET" "/rules/$rule_id/history"

  log ""
  log "== Communications =="
  call_success "GET" "/communications/templates"
  call_success "POST" "/communications/templates" "{\"name\":\"capability_template_$RANDOM\",\"category\":\"marketing\",\"content\":\"Hello {{name}}\",\"variables\":[\"name\"]}" "200,201"
  call_success "GET" "/communications/queue"
  call_success "GET" "/communications/delivery-report"
  call_success "POST" "/communications/send" "{\"leadId\":\"$new_lead_id\",\"channel\":\"WHATSAPP\",\"content\":\"Capability ping\"}"

  log ""
  log "== Webhooks =="
  call_success "POST" "/webhooks/meta" "{\"sample\":true}"
  call_success "POST" "/webhooks/google" "{\"sample\":true}"
  call_success "POST" "/webhooks/whatsapp" "{\"sample\":true}"
  call_success "POST" "/webhooks/indiamart" "{\"sample\":true}"

  log ""
  log "== Settings & Admin =="
  call_success "GET" "/settings"
  call_success "PUT" "/settings" "{\"timezone\":\"Asia/Kolkata\"}"
  call_success "GET" "/team"
  call_success "POST" "/team/invite" "{\"email\":\"invite+$RANDOM@dealflow.ai\",\"name\":\"Invite User\",\"role\":\"BROKER\"}" "200,201"
  call_success "PUT" "/team/$broker_id/role" "{\"role\":\"BROKER\"}"
  call_success "GET" "/audit-logs"
  call_success "GET" "/api-keys"
  call_success "POST" "/api-keys" "{\"name\":\"capability-key-$RANDOM\",\"permissions\":[\"leads:read\"]}" "200,201"

  log ""
  log "== Future Feature Stubs =="
  for feature in \
    ai-chat-assistant webhook-builder report-builder multilanguage mobile-shell \
    channel-partner-portal client-portal ai-price-optimization demand-heatmap \
    ad-optimizer sell-through-predictor document-generation payment-tracking \
    chatbot-builder api-marketplace; do
    call_not_implemented "GET" "/future/$feature"
    call_not_implemented "POST" "/future/$feature" "{}"
  done

  call_not_implemented "GET" "/integrations/future/ai-chat-assistant"
  call_not_implemented "GET" "/integrations/future/webhook-builder"
  call_not_implemented "GET" "/integrations/future/report-builder"
  call_not_implemented "GET" "/integrations/future/multilanguage"
  call_not_implemented "GET" "/integrations/future/mobile-shell"
  call_not_implemented "GET" "/integrations/future/channel-partner-portal"
  call_not_implemented "GET" "/integrations/future/client-portal"
  call_not_implemented "GET" "/integrations/future/ai-price-optimization"
  call_not_implemented "GET" "/integrations/future/demand-heatmap"
  call_not_implemented "GET" "/integrations/future/ad-optimizer"
  call_not_implemented "GET" "/integrations/future/sell-through-predictor"
  call_not_implemented "GET" "/integrations/future/document-generation"
  call_not_implemented "GET" "/integrations/future/payment-tracking"
  call_not_implemented "GET" "/integrations/future/chatbot-builder"
  call_not_implemented "GET" "/integrations/future/api-marketplace"

  log ""
  log "== Cleanup =="
  call_success "DELETE" "/leads/$new_lead_id"
  call_success "DELETE" "/rules/$rule_id"
  pass "Cleanup completed"

  log ""
  log "Pass: $PASS_COUNT"
  log "Fail: $FAIL_COUNT"
  if [[ "$FAIL_COUNT" -gt 0 ]]; then
    exit 1
  fi
  log "Capability check complete"
}

run
