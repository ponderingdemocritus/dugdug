import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [mkcert(), react(), wasm(), topLevelAwait(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          app: resolve(__dirname, "app/index.html"),
        },
        maxParallelFileOps: 2,
        cache: false,

        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          sourcemap: true,
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
          inlineDynamicImports: false,
          sourcemapIgnoreList: (relativeSourcePath) => {
            const normalizedPath = path.normalize(relativeSourcePath);
            return normalizedPath.includes("node_modules");
          },
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_PUBLIC_API, // Using env variable
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
