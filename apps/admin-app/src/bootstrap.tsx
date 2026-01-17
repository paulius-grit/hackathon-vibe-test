import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MicroAppRenderer } from "@mf-hub/router";
import { routeConfig } from "./routes";
import "./index.css";

/**
 * Standalone entry point for development.
 * When loaded via Module Federation, only routes.ts is used.
 *
 * In standalone mode, we use browser history at "/" base path,
 * so the app works as a normal single-page app during development.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <div className="min-h-screen">
      <div className="p-4 border-b bg-muted/30">
        <p className="text-sm text-muted-foreground">
          ⚡ Running in standalone mode
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
