import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "demoApp",
      filename: "remoteEntry.js",
      exposes: {
        "./routes": "./src/routes.ts",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "@tanstack/react-router": {
          singleton: true,
          requiredVersion: "^1.154.0",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    // modulePreload must be true for Module Federation shared modules to work correctly
    modulePreload: true,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
});
