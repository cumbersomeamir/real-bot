#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DBPATH="${DBPATH:-$ROOT_DIR/.data/mongo-rs}"
PORT="${MONGO_PORT:-27017}"

if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "No mongod listening on port $PORT"
  exit 0
fi

echo "Shutting down mongod on port $PORT..."
mongosh --quiet "mongodb://127.0.0.1:$PORT/admin" --eval "db.adminCommand({shutdown:1, force:true})" >/dev/null 2>&1 || true

if [[ -f "$DBPATH/mongod.pid" ]]; then
  pid="$(cat "$DBPATH/mongod.pid" || true)"
  if [[ -n "${pid:-}" ]]; then
    kill "$pid" >/dev/null 2>&1 || true
  fi
fi
echo "Shutdown requested."
