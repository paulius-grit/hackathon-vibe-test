import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
  __federation_method_ensure,
} from "virtual:__federation__";
import { initFederation } from "@mf-hub/loader";
import { LoadedAppsProvider } from "./context/LoadedAppsContext";
import { RemoteAppConfig, RemotesProvider } from "./context/RemotesContext";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// Initialize federation with the virtual module methods
// This enables the loader library to register and load remote modules
initFederation({
  setRemote: __federation_method_setRemote,
  getRemote: __federation_method_getRemote,
  unwrapDefault: __federation_method_unwrapDefault,
  ensure: __federation_method_ensure,
});

// Fallback remotes in case API is unavailable
const fallbackRemotes: RemoteAppConfig[] = [];

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RemotesProvider fallbackRemotes={fallbackRemotes}>
      <LoadedAppsProvider>
        <RouterProvider router={router} />
      </LoadedAppsProvider>
    </RemotesProvider>
  </StrictMode>
);
