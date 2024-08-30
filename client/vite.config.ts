import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import svgr from "vite-plugin-svgr";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [mkcert(), react(), wasm(), topLevelAwait(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_PUBLIC_API, // Replace with your API server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
