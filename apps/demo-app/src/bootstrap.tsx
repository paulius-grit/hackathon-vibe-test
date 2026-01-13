import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Standalone entry point for development.
 * When loaded via Module Federation, only App.tsx is used.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <div className="p-8">
      <p className="mb-4 text-sm text-muted-foreground">
        ⚡ Running in standalone mode
      </p>
      <App />
    </div>
  </StrictMode>
);
