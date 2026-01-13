import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

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
    <div style={{ padding: "2rem" }}>
      <p style={{ marginBottom: "1rem", color: "#64748b", fontSize: "0.875rem" }}>
        ⚡ Running in standalone mode
      </p>
      <App />
    </div>
  </StrictMode>
);
