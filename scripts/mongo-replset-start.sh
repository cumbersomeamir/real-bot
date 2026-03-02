#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DBPATH="${DBPATH:-$ROOT_DIR/.data/mongo-rs}"
PORT="${MONGO_PORT:-27017}"
REPLSET="${MONGO_REPLSET:-rs0}"

mkdir -p "$DBPATH"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stop existing mongod or set MONGO_PORT to another port."
  exit 1
fi

echo "Starting mongod replica set ($REPLSET) on port $PORT..."
nohup mongod --replSet "$REPLSET" --bind_ip 127.0.0.1 --port "$PORT" --dbpath "$DBPATH" >"$DBPATH/mongod.log" 2>&1 &
echo $! > "$DBPATH/mongod.pid"

echo "Initiating replica set..."
mongosh --quiet "mongodb://127.0.0.1:$PORT/admin" --eval "rs.initiate({_id:'$REPLSET', members:[{_id:0, host:'127.0.0.1:$PORT'}]})" >/dev/null 2>&1 || true

echo "Waiting for PRIMARY..."
for i in {1..30}; do
  state="$(mongosh --quiet "mongodb://127.0.0.1:$PORT/admin" --eval "rs.status().myState" 2>/dev/null | tail -n 1 || true)"
  if [[ "$state" == "1" ]]; then
    echo "Mongo replica set ready (PRIMARY)."
    exit 0
  fi
  sleep 1
done

echo "Replica set did not become PRIMARY in time. Check log at $DBPATH/mongod.log"
exit 1
