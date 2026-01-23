import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  init,
  loadRemote as mfLoadRemote,
  registerRemotes,
} from "@module-federation/enhanced/runtime";
import { initFederation } from "@mf-hub/loader";
import { LoadedAppsProvider } from "./context/LoadedAppsContext";
import { RemoteAppConfig, RemotesProvider } from "./context/RemotesContext";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// Initialize Module Federation runtime
init({
  name: "container",
  remotes: [],
  shared: {
    react: {
      version: "18.3.1",
      lib: () => import("react"),
      shareConfig: {
        singleton: true,
        requiredVersion: "^18.0.0",
      },
    },
    "react-dom": {
      version: "18.3.1",
      lib: () => import("react-dom"),
      shareConfig: {
        singleton: true,
        requiredVersion: "^18.0.0",
      },
    },
    "@tanstack/react-router": {
      version: "1.45.0",
      lib: () => import("@tanstack/react-router"),
      shareConfig: {
        singleton: true,
        requiredVersion: "^1.45.0",
      },
    },
  },
});

// Initialize the loader with the Module Federation runtime API
// Use a wrapper to match the loader's expected type signature
initFederation({
  loadRemote: (id, options) =>
    mfLoadRemote(id, { from: "runtime", ...options }),
  registerRemotes: registerRemotes,
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
  </StrictMode>,
);
