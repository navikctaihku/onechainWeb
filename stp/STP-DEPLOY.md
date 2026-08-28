# Deploy OneChain website on STP server

Static site (`onechainwebsitMockup`) — no frpc needed unless you run a dev server on another machine.

## Step 1 — DNS

1. Open your DNS panel (e.g. `http://hiro-corp.com:2221`)
2. **DNS Management** → Add record:
   - **Name:** `onechain` (or `www`)
   - **Type:** `A`
   - **Value:** `43.159.33.46`
3. Click **Add**

Wait a few minutes for DNS to propagate.

## Step 2 — One-time server setup (SSH)

```bash
ssh ubuntu@43.159.33.46 -p 9522
```

### A. Web root

```bash
sudo mkdir -p /var/www/onechain
sudo chown -R ubuntu:ubuntu /var/www/onechain
```

### B. Nginx config

On your **Mac**, edit `stp/nginx-onechain.conf` — replace `onechain.yourdomain.com` with your real domain (e.g. `onechain.example.com`).

Copy to server:

```bash
scp -P 9522 stp/nginx-onechain.conf ubuntu@43.159.33.46:/tmp/onechain.conf
```

On the **server**:

```bash
sudo mv /tmp/onechain.conf /etc/nginx/sites-available/onechain.yourdomain.com
sudo ln -sf /etc/nginx/sites-available/onechain.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### C. SSL (HTTPS)

```bash
sudo certbot --nginx -d onechain.yourdomain.com
```

## Step 3 — Deploy from your Mac

```bash
cd /Users/navikctai/work/OneChain/Onechain_code
cp stp/.stp.env.example .stp.env
# Edit .stp.env — set STP_DOMAIN to your real domain

./deploy-stp.sh
```

Re-run `./deploy-stp.sh` whenever you change the website.

## When to use frpc (from your STP doc)

Use **frpc** only if the app runs on an **internal** machine (e.g. `192.168.16.165:3000`) and the public server proxies to port `33000`.

For this **static HTML site**, skip frpc — upload files with `deploy-stp.sh` and let nginx serve `/var/www/onechain` directly.

## Quick local preview before deploy

```bash
cd onechainwebsitMockup
python3 -m http.server 8787
# open http://localhost:8787
```
