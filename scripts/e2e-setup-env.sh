#!/usr/bin/env bash
# Script 3: E2E Environment Setup
# Provisions the test database using Docker/Podman.
# Pulls apache/age image, starts container, waits for readiness.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTAINER_NAME="ageviewer-e2e-db"

# Source .env from project root if it exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

echo "🚀 Setting up E2E environment..."

# Detect container runtime
if command -v docker &> /dev/null; then
  CONTAINER_RUNTIME="docker"
elif command -v podman &> /dev/null; then
  CONTAINER_RUNTIME="podman"
else
  echo "❌ Neither Docker nor Podman found."
  echo "   Install Docker: https://docs.docker.com/get-docker/"
  echo "   Or Podman: https://podman.io/getting-started/installation"
  exit 1
fi

echo "📦 Using container runtime: $CONTAINER_RUNTIME"

# Verify E2E_DB_PASSWORD is set
if [ -z "$E2E_DB_PASSWORD" ]; then
  echo "❌ E2E_DB_PASSWORD environment variable must be set."
  echo "   Example: export E2E_DB_PASSWORD=your_test_password"
  exit 1
fi

# Stop existing container if present (stale state)
if $CONTAINER_RUNTIME ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
  echo "🧹 Removing existing container..."
  $CONTAINER_RUNTIME stop "$CONTAINER_NAME" 2>/dev/null || true
  $CONTAINER_RUNTIME rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# Pull image and start
echo "📥 Pulling apache/age image (if not cached)..."
$CONTAINER_RUNTIME pull apache/age:latest

echo "▶️  Starting test database..."
$CONTAINER_RUNTIME run -d \
  --name "$CONTAINER_NAME" \
  -p "${E2E_DB_PORT:-5455}:5432" \
  -e "POSTGRES_USER=${E2E_DB_USER:-ageviewer_e2e}" \
  -e "POSTGRES_PASSWORD=${E2E_DB_PASSWORD}" \
  -e "POSTGRES_DB=${E2E_DB_NAME:-ageviewer_e2e}" \
  apache/age:latest

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to accept connections..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if $CONTAINER_RUNTIME exec "$CONTAINER_NAME" pg_isready -U ageviewer_e2e -d ageviewer_e2e &> /dev/null; then
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  sleep 1
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ PostgreSQL failed to start within ${MAX_RETRIES}s"
  $COMPOSE_CMD -f "$COMPOSE_FILE" logs
  exit 1
fi

echo ""
echo "✅ E2E database is ready!"
echo "   Host: localhost"
echo "   Port: ${E2E_DB_PORT:-5455}"
echo "   Database: ${E2E_DB_NAME:-ageviewer_e2e}"
echo "   User: ${E2E_DB_USER:-ageviewer_e2e}"
echo "   Password: (from E2E_DB_PASSWORD env var)"
