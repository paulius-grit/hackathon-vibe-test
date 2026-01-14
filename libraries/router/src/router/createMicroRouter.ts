import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
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
}

/**
 * Recursively builds route tree from MicroRoute definitions
 */
function buildRouteTree(
  routes: MicroRoute[],
  parentRoute: AnyRoute
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
 * Uses memory history so the micro-app manages its own routing
 * while the container manages the browser URL.
 */
export function createMicroRouter(
  options: CreateMicroRouterOptions
): Router<AnyRoute> {
  const { config, basePath, initialPath = "/" } = options;

  // Create root route with optional layout
  const rootRoute = createRootRoute({
    component: config.layout as RouteComponent | undefined,
    notFoundComponent: config.notFoundComponent as RouteComponent | undefined,
    errorComponent: config.errorBoundary as RouteComponent | undefined,
  });

  // Build route tree
  const routeTree = buildRouteTree(config.routes, rootRoute);
  const routeTreeWithChildren = rootRoute.addChildren(routeTree);

  // Create memory history for isolation
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialPath],
  });

  // Create and return router
  const router = createRouter({
    routeTree: routeTreeWithChildren,
    history: memoryHistory,
    basepath: basePath,
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
