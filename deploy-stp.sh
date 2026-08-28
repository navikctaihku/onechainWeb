#!/bin/bash
# Deploy OneChain classic mockup to your STP server (static files + nginx).
# Matches the STP workflow: DNS → SSH → upload → nginx → certbot.
#
# One-time setup: see stp/STP-DEPLOY.md
# Usage:
#   cp stp/.stp.env.example .stp.env   # edit domain + SSH
#   ./deploy-stp.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$ROOT/onechainwebsitMockup"
ENV_FILE="$ROOT/.stp.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "  cp stp/.stp.env.example .stp.env"
  echo "  # then edit STP_DOMAIN, STP_HOST, etc."
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

: "${STP_HOST:?Set STP_HOST in .stp.env}"
: "${STP_SSH_PORT:=9522}"
: "${STP_SSH_USER:=ubuntu}"
: "${STP_WEB_ROOT:=/var/www/onechain}"

SSH_TARGET="${STP_SSH_USER}@${STP_HOST}"
SSH_KEY_ARGS=()
if [[ -n "${STP_SSH_KEY:-}" && -f "${STP_SSH_KEY}" ]]; then
  SSH_KEY_ARGS=(-i "${STP_SSH_KEY}")
fi
RSYNC_SSH="ssh -p ${STP_SSH_PORT} -o StrictHostKeyChecking=accept-new ${SSH_KEY_ARGS[*]}"

echo "════════════════════════════════════════════════════════"
echo "  Deploy OneChain website → STP server"
echo "  Host:  ${SSH_TARGET}:${STP_SSH_PORT}"
echo "  Path:  ${STP_WEB_ROOT}"
if [[ -n "${STP_DOMAIN:-}" ]]; then
  echo "  URL:   https://${STP_DOMAIN}/"
fi
echo "════════════════════════════════════════════════════════"
echo ""

echo "→ Creating web root on server (if needed)..."
ssh -p "$STP_SSH_PORT" "${SSH_KEY_ARGS[@]}" "$SSH_TARGET" "sudo mkdir -p '${STP_WEB_ROOT}' && sudo chown -R \$(whoami):\$(whoami) '${STP_WEB_ROOT}'"

echo "→ Uploading site files..."
rsync -avz --delete \
  -e "$RSYNC_SSH" \
  --exclude 'node_modules' \
  --exclude '.DS_Store' \
  --exclude 'prompting-guide-dynamic-effects.md' \
  --exclude '*.canvas' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  "$SOURCE/" "${SSH_TARGET}:${STP_WEB_ROOT}/"

echo ""
echo "✓ Files uploaded to ${STP_WEB_ROOT}"
echo ""
if [[ -n "${STP_DOMAIN:-}" ]]; then
  echo "If nginx is configured, your site should be at:"
  echo "  https://${STP_DOMAIN}/"
else
  echo "Next: configure nginx (see stp/STP-DEPLOY.md)"
fi
echo ""
