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

**https://navikctaihku.github.io/onechainWeb/**

Pushing to `main` automatically rebuilds and deploys via GitHub Actions.

### First-time GitHub Pages setup

1. Open **https://github.com/navikctaihku/onechainWeb/settings/pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually under **Actions**)

## Build for production

```bash
cd onechain_website
npm run build          # local / Vercel
npm run build:ghpages  # GitHub Pages (uses /onechainWeb/ base path)
```
