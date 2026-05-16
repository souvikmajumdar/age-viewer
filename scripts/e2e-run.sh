#!/usr/bin/env bash
# Script 1: E2E Orchestrator
# Checks environment, sets up if needed, then runs tests.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Source .env from project root if it exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

echo "========================================="
echo "  AGE Viewer — E2E Test Runner"
echo "========================================="
echo ""

# Step 1: Check if environment is ready
echo "📋 Step 1: Checking environment..."
if "$SCRIPT_DIR/e2e-check-env.sh"; then
  echo ""
  echo "Environment is ready. Skipping setup."
else
  echo ""
  echo "📋 Step 2: Setting up environment..."
  "$SCRIPT_DIR/e2e-setup-env.sh"
  echo ""
fi

# Step 3: Run tests
echo "📋 Step 3: Running E2E tests..."
echo ""
"$SCRIPT_DIR/e2e-test.sh" "$@"
