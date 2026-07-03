#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
GH="$ROOT/.tools/gh_2.96.0_macOS_arm64/bin/gh"
SITE_REPO="navikctaihku/navikctaihku.github.io"
LIVE_URL="https://navikctaihku.github.io/"
SOURCE_DIR="$ROOT/onechainwebsitMockup"

if [[ ! -x "$GH" ]]; then
  echo "GitHub CLI not found at $GH"
  exit 1
fi

cd "$ROOT"

# ── 1. GitHub login ──────────────────────────────────────────────────────────
if ! "$GH" auth status >/dev/null 2>&1; then
  echo ""
  echo "Sign in to GitHub:"
  echo "  1. Copy the code below"
  echo "  2. Open https://github.com/login/device"
  echo "  3. Paste the code and click Authorize"
  echo ""
  printf 'y\n' | "$GH" auth login --hostname github.com --git-protocol https --web --skip-ssh-key
  echo ""
fi

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "GitHub login failed. Run: $GH auth login"
  exit 1
fi

echo "✓ Signed in to GitHub"
echo ""

# ── 2. Push source to onechainWeb ─────────────────────────────────────────────
echo "Pushing source to onechainWeb..."
git push -u origin main 2>/dev/null || git push origin main
echo "✓ Source pushed"
echo ""

# ── 3. Deploy mockup to navikctaihku.github.io ───────────────────────────────
echo "Deploying to $SITE_REPO ..."
DEPLOY_DIR="$(mktemp -d)"

if "$GH" repo view "$SITE_REPO" >/dev/null 2>&1; then
  git clone "https://github.com/${SITE_REPO}.git" "$DEPLOY_DIR" --depth 1
else
  "$GH" repo create "$SITE_REPO" --public --description "OneChain marketing website"
  git clone "https://github.com/${SITE_REPO}.git" "$DEPLOY_DIR" --depth 1
fi

find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
rsync -a \
  --exclude 'node_modules' \
  --exclude '.DS_Store' \
  --exclude 'prompting-guide-dynamic-effects.md' \
  --exclude '*.canvas' \
  "$SOURCE_DIR/" "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"
git add -A
if git diff --cached --quiet; then
  echo "✓ Site already up to date"
else
  git commit -m "Deploy OneChain website $(date +%Y-%m-%d)"
  git push origin main
  echo "✓ Site deployed"
fi

"$GH" api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/${SITE_REPO}/pages" \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/ \
  >/dev/null 2>&1 || true

rm -rf "$DEPLOY_DIR"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  DONE! Your site will be live in 1-2 minutes at:"
echo ""
echo "    $LIVE_URL"
echo "════════════════════════════════════════════════════════"
echo ""
