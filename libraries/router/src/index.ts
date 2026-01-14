// Types
export type {
  MicroRoute,
  MicroAppRouteConfig,
  MicroAppProps,
  MicroAppModule,
  BasePathContextValue,
} from "./types";

// Context
export {
  BasePathProvider,
  useBasePath,
  useIsEmbedded,
} from "./context/BasePathContext";

// Router utilities
export {
  createMicroRouter,
  defineRoutes,
  defineRoute,
  type CreateMicroRouterOptions,
} from "./router/createMicroRouter";

// Components
export { MicroLink, type MicroLinkProps } from "./components/MicroLink";
export {
  MicroAppRenderer,
  type MicroAppRendererProps,
} from "./components/MicroAppRenderer";

// Hooks
export {
  useMicroNavigate,
  useMicroLocation,
  type NavigateOptions,
} from "./hooks/useMicroNavigate";

// Re-export essential TanStack Router utilities that apps might need
export {
  Outlet,
  useParams,
  useSearch,
  useLoaderData,
  useRouterState,
  useMatch,
} from "@tanstack/react-router";
