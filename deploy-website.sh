#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
GH="$ROOT/.tools/gh_2.96.0_macOS_arm64/bin/gh"
SITE_REPO="navikctaihku/navikctaihku.github.io"
PORTAL_URL="https://navikctaihku.github.io/"
NEW_URL="https://navikctaihku.github.io/new/"
CLASSIC_URL="https://navikctaihku.github.io/classic/"
WEBSITE_DIR="$ROOT/onechain_website"
CLASSIC_DIR="$ROOT/onechainwebsitMockup"

if [[ ! -x "$GH" ]]; then
  echo "GitHub CLI not found at $GH"
  exit 1
fi

cd "$ROOT"

if ! "$GH" auth status >/dev/null 2>&1; then
  "$ROOT/login-github.sh"
fi
"$GH" auth setup-git >/dev/null 2>&1 || true

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "GitHub login failed. Run: $GH auth login"
  exit 1
fi

echo "✓ Signed in to GitHub"
echo ""

echo "Building new site (onechain_website) for /new/ ..."
cd "$WEBSITE_DIR"
npm ci --silent
SITE_BASE=/new/ npm run build
BUILD_DIR="$WEBSITE_DIR/dist"
echo "✓ New site built: $BUILD_DIR"
echo ""

echo "Deploying portal + both sites to $SITE_REPO ..."
DEPLOY_DIR="$(mktemp -d)"

if "$GH" repo view "$SITE_REPO" >/dev/null 2>&1; then
  git clone "https://github.com/${SITE_REPO}.git" "$DEPLOY_DIR" --depth 1
else
  "$GH" repo create "$SITE_REPO" --public --description "OneChain marketing website"
  git clone "https://github.com/${SITE_REPO}.git" "$DEPLOY_DIR" --depth 1
fi

find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Root portal — pick which site to open
cp "$ROOT/site-portal.html" "$DEPLOY_DIR/index.html"

# Site 1 — new design at /new/
mkdir -p "$DEPLOY_DIR/new"
rsync -a "$BUILD_DIR/" "$DEPLOY_DIR/new/"

# Site 2 — classic mockup at /classic/
mkdir -p "$DEPLOY_DIR/classic"
rsync -a \
  --exclude 'node_modules' \
  --exclude '.DS_Store' \
  --exclude 'prompting-guide-dynamic-effects.md' \
  --exclude '*.canvas' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  --exclude 'serve.json' \
  --exclude 'Hong_Kong_recycling_ecosystem_*' \
  --exclude 'videos/Blockchain_data_chain_animation_202607091637.mp4' \
  --exclude 'videos/Holographic_blockchain_cubes_lin*' \
  --exclude 'videos/blockchain-data-chain.mp4' \
  --exclude 'videos/hero-blockchain-bg.mp4' \
  --exclude 'videos/hero-hologram.mp4' \
  --exclude 'videos/holographic-city.mp4' \
  --exclude 'videos/isometric-globe-blockchain.mp4' \
  --exclude 'videos/isometric-globe-blockchain-v2.mp4' \
  "$CLASSIC_DIR/" "$DEPLOY_DIR/classic/"

touch "$DEPLOY_DIR/.nojekyll"
touch "$DEPLOY_DIR/new/.nojekyll"
touch "$DEPLOY_DIR/classic/.nojekyll"

cd "$DEPLOY_DIR"
git add -A
if git diff --cached --quiet; then
  echo "✓ Sites already up to date"
else
  git commit -m "Deploy portal + both OneChain sites $(date +%Y-%m-%d)"
  git push origin main
  echo "✓ Sites deployed"
fi

"$GH" api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/${SITE_REPO}/pages" \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/ \
  >/dev/null 2>&1 || true

"$GH" api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "repos/${SITE_REPO}/pages/builds" \
  >/dev/null 2>&1 || true

rm -rf "$DEPLOY_DIR"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  DONE! Three links — portal + two independent sites:"
echo ""
echo "  Portal (pick a version):  $PORTAL_URL"
echo "  NEW design:             $NEW_URL"
echo "  CLASSIC design:         $CLASSIC_URL"
echo ""
echo "  Allow 2–3 minutes for GitHub Pages to update."
echo "  Hard refresh: Cmd+Shift+R"
echo "════════════════════════════════════════════════════════"
echo ""
