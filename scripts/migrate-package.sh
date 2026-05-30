#!/usr/bin/env bash
#
# migrate-package.sh
# Packages the AGE Viewer project for migration to a new machine.
#
# What it does:
#   1. Commits any in-progress (WIP) work on the current branch so nothing is lost.
#   2. Creates a git bundle (full history + all branches) as a portable backup.
#   3. Produces a clean zip of the working tree, EXCLUDING regenerable artifacts
#      (node_modules, build output, coverage, logs, test reports).
#
# The zip + bundle together let you continue on the new laptop exactly where you
# left off, including your current branch and committed WIP.
#
# Usage:  ./scripts/migrate-package.sh
#
set -euo pipefail

# Resolve repo root regardless of where the script is called from.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PROJECT_NAME="$(basename "$ROOT")"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="${TMPDIR:-/tmp}/age-viewer-migration-${STAMP}"
BUNDLE="${OUT_DIR}/${PROJECT_NAME}.bundle"
ZIP="${OUT_DIR}/${PROJECT_NAME}-${STAMP}.zip"

mkdir -p "$OUT_DIR"

echo "==> Repo: $ROOT"
echo "==> Current branch: $(git rev-parse --abbrev-ref HEAD)"

# ---------------------------------------------------------------------------
# 1. Commit WIP so the in-progress TypeScript migration work is preserved.
# ---------------------------------------------------------------------------
if [[ -n "$(git status --porcelain)" ]]; then
  echo "==> Uncommitted changes detected. Creating a WIP checkpoint commit..."
  git add -A
  git commit -m "chore: WIP checkpoint before laptop migration (${STAMP})"
  echo "    Committed. (You can soft-reset this later with: git reset --soft HEAD~1)"
else
  echo "==> Working tree clean. No WIP commit needed."
fi

# ---------------------------------------------------------------------------
# 2. Create a portable git bundle with full history and all branches.
# ---------------------------------------------------------------------------
echo "==> Creating git bundle (full history, all branches)..."
git bundle create "$BUNDLE" --all
echo "    Bundle: $BUNDLE"

# ---------------------------------------------------------------------------
# 3. Zip the working tree, excluding regenerable / runtime artifacts.
#    .git IS included so the new machine has full history + working tree.
# ---------------------------------------------------------------------------
echo "==> Creating project zip (excluding node_modules, build, coverage, logs)..."
cd "$ROOT/.."
zip -r -q "$ZIP" "$PROJECT_NAME" \
  -x "${PROJECT_NAME}/node_modules/*" \
  -x "${PROJECT_NAME}/backend/node_modules/*" \
  -x "${PROJECT_NAME}/frontend/node_modules/*" \
  -x "${PROJECT_NAME}/frontend/build/*" \
  -x "${PROJECT_NAME}/backend/coverage/*" \
  -x "${PROJECT_NAME}/backend/logs/*" \
  -x "${PROJECT_NAME}/playwright-report/*" \
  -x "${PROJECT_NAME}/test-results/*" \
  -x "${PROJECT_NAME}/frontend/src/conf/config.js" \
  -x "*.DS_Store"

echo ""
echo "============================================================"
echo " Packaging complete."
echo "   Zip:    $ZIP"
echo "   Bundle: $BUNDLE"
echo ""
echo " Copy BOTH files to your new laptop, then follow"
echo " .kiro/docs/migration-guide.md"
echo "============================================================"
