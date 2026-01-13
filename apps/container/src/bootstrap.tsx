import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { registerSharedModules } from "@mf-hub/loader";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// Register shared modules for Module Federation
// This makes the host's React available to remote apps
registerSharedModules([
  {
    name: "react",
    version: "18.3.1",
    getter: () => import("react"),
  },
  {
    name: "react-dom",
    version: "18.3.1",
    getter: () => import("react-dom"),
  },
]);

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
    <RouterProvider router={router} />
  </StrictMode>
);
