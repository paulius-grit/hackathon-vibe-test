import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// import { registerSharedModules } from "@mf-hub/loader";
import { LoadedAppsProvider } from "./context/LoadedAppsContext";
import { RemoteAppConfig, RemotesProvider } from "./context/RemotesContext";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// Register shared modules for Module Federation
// This makes the host's React available to remote apps
// registerSharedModules([
//   {
//     name: "react",
//     version: "18.3.1",
//     getter: () => import("react"),
//   },
//   {
//     name: "react-dom",
//     version: "18.3.1",
//     getter: () => import("react-dom"),
//   },
// ]);

// Fallback remotes in case API is unavailable
const fallbackRemotes: RemoteAppConfig[] = [
  // {
  //   name: "demo-app",
  //   title: "Demo Application Test",
  //   icon: "Target",
  //   url: "http://localhost:3001",
  //   scope: "demo-app",
  //   module: "./App",
  // },
  // {
  //   name: "calendar-app",
  //   title: "Mystical Calendar",
  //   icon: "Calendar",
  //   url: "http://localhost:3002",
  //   scope: "calendarApp",
  //   module: "./App",
  // },
];

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
