import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    federation({
      name: "container",
      // Add a placeholder remote to force the plugin to generate proper share scope code
      // Actual remotes are loaded dynamically at runtime via the loader library
      remotes: {
        // This placeholder is never actually loaded - it just triggers proper share scope generation
        __placeholder__: {
          external:
            "http://localhost:9999/__placeholder__/assets/remoteEntry.js",
          format: "esm",
          from: "vite",
        },
      },
      shared: ["react", "react-dom", "@tanstack/react-router"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
