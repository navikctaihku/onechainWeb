import { defineConfig } from "vite";
import { resolve } from "path";

// Set SITE_BASE=/new/ when deploying as a subfolder on GitHub Pages
const base = process.env.SITE_BASE || "/";

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
