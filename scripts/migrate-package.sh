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
#   4. Copies Kiro session history (chat conversations) into the zip as an archive
#      under kiro-sessions/ so the context from past sessions is preserved.
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
SESSIONS_STAGING="${OUT_DIR}/kiro-sessions"

mkdir -p "$OUT_DIR"

echo "==> Repo: $ROOT"
echo "==> Current branch: $(git rev-parse --abbrev-ref HEAD)"

# ---------------------------------------------------------------------------
# 1. Commit WIP if anything is uncommitted.
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
# 3. Copy Kiro session history for this workspace into a staging folder.
#    Sessions are stored under a base64-encoded workspace path. We find the
#    folder whose decoded name matches this repo's path.
# ---------------------------------------------------------------------------
echo "==> Looking for Kiro session history..."

KIRO_SESSIONS_ROOT="${HOME}/Library/Application Support/Kiro/User/globalStorage/kiro.kiroagent/workspace-sessions"
SESSIONS_FOUND=0

if [[ -d "$KIRO_SESSIONS_ROOT" ]]; then
  for folder in "$KIRO_SESSIONS_ROOT"/*/; do
    folder_name="$(basename "$folder")"
    # Decode the base64 folder name (pad to multiple of 4, replace _ with /)
    padded="${folder_name}==="
    decoded="$(echo "$padded" | tr '_-' '/+' | base64 -d 2>/dev/null || true)"
    # Strip trailing ? or garbage characters from decoded path
    decoded_clean="${decoded%%\?*}"
    if [[ "$decoded_clean" == "$ROOT" ]]; then
      echo "    Found session folder: $folder_name"
      echo "    Decoded path: $decoded_clean"
      mkdir -p "$SESSIONS_STAGING"
      cp -r "$folder" "$SESSIONS_STAGING/"
      # Also copy the sessions index
      SESSIONS_FOUND=1
      break
    fi
  done
fi

if [[ $SESSIONS_FOUND -eq 0 ]]; then
  echo "    No matching Kiro session folder found for this workspace. Skipping."
  echo "    (Expected workspace path: $ROOT)"
fi

# ---------------------------------------------------------------------------
# 4. Zip the working tree, excluding regenerable / runtime artifacts.
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

# Add Kiro sessions into the zip under kiro-sessions/ if we found them.
if [[ $SESSIONS_FOUND -eq 1 ]]; then
  echo "==> Adding Kiro session history to zip..."
  cd "$OUT_DIR"
  zip -r -q "$ZIP" kiro-sessions/ -x "*.DS_Store"
  echo "    Sessions added under kiro-sessions/ in the zip."
fi

echo ""
echo "============================================================"
echo " Packaging complete."
echo "   Zip:    $ZIP"
echo "   Bundle: $BUNDLE"
echo ""
echo " Copy BOTH files to your new laptop, then follow"
echo " .kiro/docs/migration-guide.md"
echo "============================================================"
