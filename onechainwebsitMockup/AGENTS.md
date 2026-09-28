# OneChain website — rules for every AI agent (Claude, Cursor, …)

## Where to work
- The website is **`onechainwebsitMockup/`**. All website edits go in this folder.
- Do **not** edit `onechain_website/` (a separate Vite site) unless the owner explicitly asks.
- On the owner's Mac this folder is:
  `/Users/navikctai/work/OneChain/Onechain_code/onechainwebsitMockup`
  (The GitHub repo is `navikctaihku/onechainWeb`; cloud sessions clone it into a
  folder named `onechainWeb`. It is the same repo as `Onechain_code` — not a second project.)

## Branch: always `main`
Both Claude and Cursor work on the same branch so changes never go missing.

1. **Before starting any task**: `git checkout main && git pull origin main`
2. **After every finished change**: commit and `git push origin main` right away.
   Never leave work only on the local machine — the other tool can only see what is on GitHub.
3. If you must use a feature branch, merge the latest `main` into it first and merge it
   back into `main` as soon as the change is done.

## Local preview
```bash
cd onechainwebsitMockup
npm install
npm run dev        # http://localhost:3000/index.html
```

## Assets
- `*.mp4` is gitignored at the repo root. Add a new video with `git add -f videos/<file>.mp4`.
- Hero background video: `videos/hero-blockchain-loop.mp4` (+ `.webm` fallback,
  poster `hero-blockchain-loop-poster.jpg`). It is a seamless loop — first and last frame match.
- Brand colours live in `tokens.css` (OneChain blue `#14a4bc`). `global.css` holds no `:root` block.

## Deploy (live site)
From the repo root on the owner's Mac: `./deploy-website.sh`
→ this folder goes live at https://navikctaihku.github.io/classic/
