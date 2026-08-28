#!/bin/bash
# Paste this entire script into 1Panel → Terminal (run as root or with sudo).
# One-time server setup: SSH key + web root + nginx for static site.

set -euo pipefail

DOMAIN="onechainwebsitemockup.ai-rwa.xyz"
WEB_ROOT="/var/www/onechain"
PUBKEY='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDBA65FTXXYFXVuqOmqIWlU986bDAx3lAlSAMzw8cxgJ6p0d5r6zDm4VBPzOvGa9AuWTIIvhpwuxq+KznKiOAooDeuPcHWHXL9ewgsfEdagToMh9vA9pPnnRcTdJjltudGOh/pb5KBiVdBD1oafBbMQcj1Q0qk2Ug11/gaGC8vXT8NyijLWQHgJGyEygVcnlelgtBAxqiV1ab9vEIRFfvkxGFlQml35UB3bMbgGojwiEm2uWX65ABYmPjN+NhoknYL0VKuVWcu0Ea3wzFL2bW9tT7lpQBv0zPfac/tqdZLAB7QDmiZtwIqWrsPrMN+WCcy9cFCE3URkujftmk88Yxj1N5iua3LfldfXpgn0lHHU/HGs5BotzbJ2AOorzR61sp8OJ0F8F/CgpwEUx2/aYKSFj0rNWawZmWumPW+xli2hnp8JEH8RJnRqyQmIcxcOnEKKzGw1nOqWJ22Qx0p30SKsDRaVISbjH3zr6WJDgDsCzbgHcK03HYtiQ1VtRiWa5RgIAlVLCBhyI9SH+9F6Q2g75wWRdgOzU1rffpC+jAghoGq5PV69dosRXo7IY/K1gMpzDyzzdvSj3bXs4vQGuRTWmyx2vnFg8OuVhN2UYzGmPxjCBoHXQOmj/xYxOvZKDJJKisxn/DJeu7+A1NguUt16NyuJTCj2y6y+VOD92o4Psw== navikctaihku@gmail.com'

echo "→ Adding SSH key for ubuntu..."
mkdir -p /home/ubuntu/.ssh
grep -qF "$PUBKEY" /home/ubuntu/.ssh/authorized_keys 2>/dev/null || echo "$PUBKEY" >> /home/ubuntu/.ssh/authorized_keys
chown -R ubuntu:ubuntu /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh
chmod 600 /home/ubuntu/.ssh/authorized_keys

echo "→ Creating web root ${WEB_ROOT}..."
mkdir -p "$WEB_ROOT"
chown -R ubuntu:ubuntu "$WEB_ROOT"

echo "→ Writing nginx config for ${DOMAIN}..."
cat > "/etc/nginx/sites-available/${DOMAIN}" <<'NGINX'
server {
    listen 80;
    server_name onechainwebsitemockup.ai-rwa.xyz;

    root /var/www/onechain;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    location ~* \.(mp4|jpg|jpeg|png|webp|svg|ico|js|css|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;
}
NGINX

ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t
systemctl reload nginx

echo ""
echo "✓ Done. Next on your Mac:"
echo "  ssh -i ~/.ssh/ssh_key -p 9522 ubuntu@43.159.33.46"
echo "  cd Onechain_code && ./deploy-stp.sh"
echo "  sudo certbot --nginx -d ${DOMAIN}   # run on server for HTTPS"
echo ""
