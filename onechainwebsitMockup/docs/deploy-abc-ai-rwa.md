# Deploy abc.ai-rwa.xyz — Step-by-Step

---

## Step 1: DNS Record

1. Open http://hiro-corp.com:2221
2. Log in
3. Click **DNS Management**
4. Add a record:
   - **Name:** `abc`
   - **Value:** point to `43.159.33.46`
5. Click **Add**

---

## Step 2: Nginx Config + SSL

### 2A. SSH into the server

```bash
ssh ubuntu@43.159.33.46 -p 9522
```

### 2B. Create the nginx config

```bash
sudo nano /etc/nginx/sites-available/abc.ai-rwa.xyz
```

Paste this entire block:

```nginx
server {
    server_name abc.ai-rwa.xyz;
    location / {
        proxy_pass http://127.0.0.1:33000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

### 2C. Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/abc.ai-rwa.xyz /etc/nginx/sites-enabled/
```

### 2D. Test and reload nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 2E. Get SSL certificate

```bash
sudo certbot --nginx -d abc.ai-rwa.xyz
```

Follow the prompts (enter email, agree to terms, choose redirect option).

---

## Step 3: FRP Tunnel in 1Panel

1. Open http://43.159.33.46:13192/c281d4f226
2. Log in
3. Go to **App Store** → **Installed** → **frpc**
4. Click **Open in installation folder**
5. Click **data**
6. Click **frpc.toml**
7. Append this block at the end of the file:

```toml
[[leo_certledger_3000]]
name       = "leo_certledger_3000"
type       = "tcp"
local_ip   = "192.168.16.205"
local_port = 3000
remote_port = 33000
```

8. Save the file
9. **Restart the FRPC service**

---

## Step 4: Verify

Open https://abc.ai-rwa.xyz in your browser. You should see the app running over HTTPS.
