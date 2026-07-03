# OneChain Website

Enterprise blockchain infrastructure marketing site.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Infrastructure | `infrastructure.html` |
| ESGLedger | `esgledger.html` |
| CertLedger | `certledger.html` |

## Run locally

```bash
cd onechain_website
npm install
npm run dev
```

Open **http://localhost:5173**

## Live site

**https://navikctaihku.github.io/**

Deploy from your machine:

```bash
./deploy-website.sh
```

Source code is also stored at **https://github.com/navikctaihku/onechainWeb**

### GitHub Actions (optional)

To enable automatic deploys on push, grant the `workflow` scope and push:

```bash
gh auth refresh -s workflow
git push origin main
```

Then set **Settings → Pages → Source** to **GitHub Actions** on the onechainWeb repo.

## Build for production

```bash
cd onechain_website
npm run build          # local / Vercel
npm run build:ghpages  # GitHub Pages (uses /onechainWeb/ base path)
```
