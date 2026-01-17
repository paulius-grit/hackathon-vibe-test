import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MicroAppRenderer } from "@mf-hub/router";
import { routeConfig } from "./routes";
import "./index.css";

/**
 * Standalone entry point for development.
 * When loaded via Module Federation, only routes.ts is used.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <div className="min-h-screen">
      <div className="p-4 border-b bg-amber-50">
        <p className="text-sm text-amber-700">
          ⚡ Webpack Demo - Running in standalone mode
        </p>
      </div>
      <MicroAppRenderer
        basePath="/"
        routeConfig={routeConfig}
        useBrowserHistory={true}
      />
    </div>
  </StrictMode>,
);
