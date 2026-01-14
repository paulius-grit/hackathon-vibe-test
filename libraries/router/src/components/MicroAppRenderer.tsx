import { useMemo, type ReactNode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { BasePathProvider } from "../context/BasePathContext";
import { createMicroRouter } from "../router/createMicroRouter";
import type { MicroAppRouteConfig, MicroAppProps } from "../types";

export interface MicroAppRendererProps extends MicroAppProps {
  /** Route configuration from the loaded micro-app */
  routeConfig: MicroAppRouteConfig;
  /** Loading fallback while router initializes */
  fallback?: ReactNode;
  /** Initial relative path within the micro-app */
  initialPath?: string;
  /**
   * Whether to use browser history (embedded mode) or memory history (standalone mode).
   * - When true: Uses browser history with basepath, URLs reflect micro-app navigation
   * - When false: Uses memory history, micro-app routing is isolated from browser URL
   * @default true
   */
  useBrowserHistory?: boolean;
}

/**
 * Renders a micro-app with its route configuration.
 * This component should be used by the container to mount micro-apps.
 */
export function MicroAppRenderer({
  basePath,
  routeConfig,
  fallback,
  initialPath = "/",
  useBrowserHistory = true,
  containerProps: _containerProps,
}: MicroAppRendererProps) {
  // Create router instance for this micro-app
  const router = useMemo(() => {
    return createMicroRouter({
      config: routeConfig,
      basePath,
      initialPath,
      useBrowserHistory,
    });
  }, [routeConfig, basePath, initialPath, useBrowserHistory]);

  return (
    <BasePathProvider basePath={basePath}>
      <RouterProvider
        router={router}
        defaultPendingComponent={() => fallback}
      />
    </BasePathProvider>
  );
}
