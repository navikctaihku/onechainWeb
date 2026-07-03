# onechain_website

Multi-page OneChain marketing site with working navigation, product pages, and live platform links.

## Run locally

```bash
cd onechain_website
npm install
npm run dev
```

Open: **http://localhost:5173**

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, industries, products, partners |
| `/about` | Company story and timeline |
| `/infrastructure` | Consortium architecture and AI services |
| `/esgledger` | ESGLedger product page → [watson.one-chain.io](https://watson.one-chain.io/) |
| `/certledger` | CertLedger product page → [app.certledger.io](https://app.certledger.io/) |

## External links

- **API Platform:** https://api.one-chain.io
- **ESGLedger live app:** https://watson.one-chain.io/
- **CertLedger live app:** https://app.certledger.io/
- **Contact:** info@one-chain.io

## Build & deploy

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host. A `vercel.json` is included for clean URLs (`/about` instead of `/about.html`).
