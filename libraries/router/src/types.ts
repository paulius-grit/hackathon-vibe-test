import type { ComponentType, ReactNode } from "react";

/**
 * A single route definition for a micro-app
 */
export interface MicroRoute {
  /** Route path relative to the app's base (e.g., "/", "/settings", "/items/:id") */
  path: string;
  /** The component to render for this route */
  component: ComponentType;
  /** Optional child routes */
  children?: MicroRoute[];
  /** Optional loader function */
  loader?: () => Promise<unknown> | unknown;
  /** Optional error boundary component */
  errorComponent?: ComponentType<{ error: Error }>;
  /** Optional pending/loading component */
  pendingComponent?: ComponentType;
}

/**
 * Route configuration exported by a micro-app
 */
export interface MicroAppRouteConfig {
  /** Array of route definitions */
  routes: MicroRoute[];
  /** Optional root layout component that wraps all routes */
  layout?: ComponentType<{ children: ReactNode }>;
  /** Optional error boundary for the entire app */
  errorBoundary?: ComponentType<{ error: Error }>;
  /** Optional not found component */
  notFoundComponent?: ComponentType;
}

/**
 * Props passed to the micro-app when mounted
 */
export interface MicroAppProps {
  /** Base path where the app is mounted (e.g., "/apps/demo-app") */
  basePath: string;
  /** Optional additional props from the container */
  containerProps?: Record<string, unknown>;
}

/**
 * The module shape that micro-apps must expose
 */
export interface MicroAppModule {
  /** Route configuration for the app */
  routeConfig: MicroAppRouteConfig;
  /** Optional initialization function */
  init?: (props: MicroAppProps) => Promise<void> | void;
}

/**
 * Context value for base path
 */
export interface BasePathContextValue {
  /** The base path where the micro-app is mounted */
  basePath: string;
  /** Resolve a relative path to an absolute path */
  resolvePath: (relativePath: string) => string;
}
