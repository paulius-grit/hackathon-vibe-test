import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  createBrowserHistory,
  type Router,
  type AnyRoute,
  type RouteComponent,
} from "@tanstack/react-router";
import type { MicroAppRouteConfig, MicroRoute } from "../types";

/**
 * Options for creating a micro-app router
 */
export interface CreateMicroRouterOptions {
  /** Route configuration from the micro-app */
  config: MicroAppRouteConfig;
  /** Base path where the app is mounted */
  basePath: string;
  /** Initial path to navigate to (relative to basePath) */
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
 * Recursively builds route tree from MicroRoute definitions
 */
function buildRouteTree(
  routes: MicroRoute[],
  parentRoute: AnyRoute,
): AnyRoute[] {
  return routes.map((routeDef) => {
    // For index routes (path "/"), we use "/" as the path
    // TanStack Router treats this as the index route of the parent
    const routePath = routeDef.path === "/" ? "/" : routeDef.path;

    const route = createRoute({
      getParentRoute: () => parentRoute,
      path: routePath,
      component: routeDef.component as RouteComponent,
      loader: routeDef.loader,
      errorComponent: routeDef.errorComponent as RouteComponent | undefined,
      pendingComponent: routeDef.pendingComponent as RouteComponent | undefined,
    });

    if (routeDef.children && routeDef.children.length > 0) {
      const childRoutes = buildRouteTree(routeDef.children, route);
      return route.addChildren(childRoutes);
    }

    return route;
  });
}

/**
 * Creates a TanStack Router instance for a micro-app.
 *
 * By default, uses browser history with basepath so that:
 * - Micro-app URLs are reflected in the browser (e.g., /apps/demo-app/info)
 * - The container can synchronize with micro-app navigation
 * - Deep linking works correctly
 *
 * For standalone development, you can use memory history which isolates
 * the micro-app routing from the browser URL.
 */
export function createMicroRouter(
  options: CreateMicroRouterOptions,
): Router<AnyRoute> {
  const {
    config,
    basePath,
    initialPath = "/",
    useBrowserHistory = true,
  } = options;

  // Create root route with optional layout
  const rootRoute = createRootRoute({
    component: config.layout as RouteComponent | undefined,
    notFoundComponent: config.notFoundComponent as RouteComponent | undefined,
    errorComponent: config.errorBoundary as RouteComponent | undefined,
  });

  // Build route tree
  const routeTree = buildRouteTree(config.routes, rootRoute);
  const routeTreeWithChildren = rootRoute.addChildren(routeTree);

  // Determine which history to use
  const history = useBrowserHistory
    ? createBrowserHistory()
    : createMemoryHistory({
        initialEntries: [initialPath],
      });

  // Create router with or without basepath depending on mode
  // For browser history, use basepath so URLs are prefixed correctly
  // For memory history, no basepath needed as we're isolated
  const router = createRouter({
    routeTree: routeTreeWithChildren,
    history,
    basepath: useBrowserHistory ? basePath : undefined,
    // Prevent flashing of loading/not-found states during quick transitions
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
    // Handle trailing slashes consistently
    trailingSlash: "never",
  });

  return router;
}

/**
 * Helper to create route configuration object
 */
export function defineRoutes(config: MicroAppRouteConfig): MicroAppRouteConfig {
  return config;
}

/**
 * Helper to create a single route
 */
export function defineRoute(route: MicroRoute): MicroRoute {
  return route;
}
