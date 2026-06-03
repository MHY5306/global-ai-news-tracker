#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting backend on http://localhost:8000"
(
  cd "$ROOT_DIR/backend"
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &

echo "Starting frontend on http://localhost:3000"
(
  cd "$ROOT_DIR/frontend"
  npm run dev
)
