#!/usr/bin/env bash
# Script 4: E2E Test Execution
# Starts backend + frontend, runs Playwright tests, cleans up.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Source .env from project root if it exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

E2E_DB_HOST="${E2E_DB_HOST:-localhost}"
E2E_DB_PORT="${E2E_DB_PORT:-5455}"
E2E_DB_USER="${E2E_DB_USER:-ageviewer_e2e}"
E2E_DB_PASSWORD="${E2E_DB_PASSWORD:?E2E_DB_PASSWORD environment variable must be set}"
E2E_DB_NAME="${E2E_DB_NAME:-ageviewer_e2e}"

BACKEND_PORT=3001
FRONTEND_PORT=3000

cleanup() {
  echo "🧹 Cleaning up..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT

# Ensure Playwright browsers are installed
if ! npx playwright install --dry-run chromium &> /dev/null; then
  echo "📥 Installing Playwright browsers..."
  npx playwright install chromium
fi

# Kill any existing processes on our ports
for port in $BACKEND_PORT $FRONTEND_PORT; do
  pid=$(lsof -ti:$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "⚠️  Killing existing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null || true
    sleep 1
  fi
done

echo "▶️  Starting backend on port $BACKEND_PORT..."
cd "$PROJECT_ROOT/backend"
PORT=$BACKEND_PORT node src/bin/www.js &
BACKEND_PID=$!

echo "▶️  Starting frontend on port $FRONTEND_PORT..."
cd "$PROJECT_ROOT/frontend"
npx vite --port $FRONTEND_PORT --strictPort &
FRONTEND_PID=$!

# Wait for services to be ready
echo "⏳ Waiting for services..."
sleep 3

# Check backend is up
for i in $(seq 1 20); do
  if curl -s "http://localhost:$BACKEND_PORT/api/v1/miscellaneous" > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Check frontend is up
for i in $(seq 1 20); do
  if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "✅ Services are ready"
echo ""
echo "🎭 Running Playwright tests..."
cd "$PROJECT_ROOT"
npx playwright test "$@"
EXIT_CODE=$?

exit $EXIT_CODE
