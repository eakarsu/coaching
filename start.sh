#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$project_dir/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$project_dir/.env"
  set +a
fi
export API_PORT="${API_PORT:-${BACKEND_PORT:-}}"
export UI_PORT="${UI_PORT:-${FRONTEND_PORT:-}}"

required() { [[ -n "${!1:-}" ]] || { echo "$1 is required" >&2; exit 1; }; }
configuration() {
  for key in DATABASE_URL API_PORT UI_PORT OPENROUTER_API_KEY OPENROUTER_MODEL OPENROUTER_BASE_URL PROVISION_ADMIN_EMAIL PROVISION_ADMIN_PASSWORD PROVISION_ADMIN_NAME; do required "$key"; done
  [[ "$API_PORT" != "$UI_PORT" ]] || { echo 'API_PORT and UI_PORT must differ' >&2; exit 1; }
  [[ "${ALLOW_SCHEMA_MIGRATION:-}" == 1 || "${ALLOW_SCHEMA_MIGRATION:-}" == true ]] || { echo 'ALLOW_SCHEMA_MIGRATION=true is required' >&2; exit 1; }
}
migrate() {
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$project_dir/migrations/001-governed-coaching.sql"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$project_dir/migrations/002-local-auth.sql"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$project_dir/migrations/003-runtime-ai-results.sql"
}
start_services() {
  migrate
  npm --prefix "$project_dir" run create-admin
  cleanup() {
    trap - INT TERM EXIT
    [[ -z "${proxy_pid:-}" ]] || kill "$proxy_pid" 2>/dev/null || true
    [[ -z "${app_pid:-}" ]] || kill "$app_pid" 2>/dev/null || true
    [[ -z "${proxy_pid:-}" ]] || wait "$proxy_pid" 2>/dev/null || true
    [[ -z "${app_pid:-}" ]] || wait "$app_pid" 2>/dev/null || true
  }
  trap cleanup INT TERM EXIT
  npm --prefix "$project_dir" start -- --hostname 127.0.0.1 --port "$API_PORT" &
  app_pid=$!
  API_PORT="$API_PORT" UI_PORT="$UI_PORT" node "$project_dir/scripts/runtime-proxy.mjs" &
  proxy_pid=$!
  wait "$app_pid" "$proxy_pid"
}

case "${1:-start}" in
  check) npm --prefix "$project_dir" test && (cd "$project_dir" && npx --no-install eslint src/app/api/runtime-ai/coaching-advice/route.ts src/proxy.ts) && NODE_ENV=production npm --prefix "$project_dir" run build ;;
  migrate) configuration; migrate ;;
  start) configuration; start_services ;;
  *) echo 'usage: ./start.sh [check|migrate|start]' >&2; exit 2 ;;
esac
