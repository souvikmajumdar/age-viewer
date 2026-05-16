#!/usr/bin/env bash
# Script 2: E2E Environment Check
# Validates that all prerequisites are met for E2E tests.
# Exit 0 = ready, Exit 1 = not ready

set -e

E2E_DB_PORT="${E2E_DB_PORT:-5455}"
E2E_DB_USER="${E2E_DB_USER:-ageviewer_e2e}"
E2E_DB_NAME="${E2E_DB_NAME:-ageviewer_e2e}"
CONTAINER_NAME="ageviewer-e2e-db"

echo "🔍 Checking E2E environment..."

# Check 1: Docker or Podman available
if command -v docker &> /dev/null; then
  CONTAINER_RUNTIME="docker"
elif command -v podman &> /dev/null; then
  CONTAINER_RUNTIME="podman"
else
  echo "❌ Neither Docker nor Podman found. Install one to run E2E tests."
  exit 1
fi
echo "✅ Container runtime: $CONTAINER_RUNTIME"

# Check 2: Container is running
if ! $CONTAINER_RUNTIME ps --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
  echo "❌ Container '$CONTAINER_NAME' is not running."
  exit 1
fi
echo "✅ Container '$CONTAINER_NAME' is running"

# Check 3: PostgreSQL is accepting connections
if command -v pg_isready &> /dev/null; then
  if ! pg_isready -h localhost -p "$E2E_DB_PORT" -U "$E2E_DB_USER" -d "$E2E_DB_NAME" &> /dev/null; then
    echo "❌ PostgreSQL not accepting connections on port $E2E_DB_PORT"
    exit 1
  fi
else
  # Fallback: try connecting via the container
  if ! $CONTAINER_RUNTIME exec "$CONTAINER_NAME" pg_isready -U "$E2E_DB_USER" -d "$E2E_DB_NAME" &> /dev/null; then
    echo "❌ PostgreSQL not accepting connections inside container"
    exit 1
  fi
fi
echo "✅ PostgreSQL accepting connections on port $E2E_DB_PORT"

echo ""
echo "✅ E2E environment is ready."
exit 0
