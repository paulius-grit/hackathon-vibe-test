import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "calendarApp",
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
  server: {
    port: 3002,
  },
  preview: {
    port: 3002,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
