import { defineConfig } from "vite";
import { resolve } from "path";

// GitHub Pages project site: https://navikctaihku.github.io/onechainWeb/
const base = process.env.GITHUB_PAGES === "true" ? "/onechainWeb/" : "/";

export default defineConfig({
  base,
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        infrastructure: resolve(__dirname, "infrastructure.html"),
        esgledger: resolve(__dirname, "esgledger.html"),
        certledger: resolve(__dirname, "certledger.html"),
      },
    },
  },
});
