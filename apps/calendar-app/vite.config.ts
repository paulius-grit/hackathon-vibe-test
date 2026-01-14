import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "calendarApp",
      filename: "remoteEntry.js",
      exposes: {
        "./routes": "./src/routes.ts",
      },
      shared: ["react", "react-dom", "@tanstack/react-router"],
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
