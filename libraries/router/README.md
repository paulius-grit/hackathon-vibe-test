# @mf-hub/router

Routing utilities for micro-frontend applications in the MF Hub ecosystem.

## Installation

```bash
pnpm add @mf-hub/router
```

## Overview

This library provides routing utilities specifically designed for micro-apps running within the MF Hub container:

- **Route Configuration**: Define routes using a simple, declarative API
- **Basepath Handling**: Automatic path resolution for embedded micro-apps
- **Browser History Integration**: URLs reflect micro-app navigation
- **Standalone Mode Support**: Same code works in both embedded and standalone modes
- **TanStack Router Integration**: Built on top of TanStack Router

## Quick Start

### 1. Define Your Routes

Create a `routes.ts` file that defines your micro-app's routes:

```typescript
import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import App from "./App";
import InfoPage from "./pages/InfoPage";

export const routeConfig = defineRoutes({
  routes: [
    { path: "/", component: App },
    { path: "/info", component: InfoPage },
  ],
});

const microAppModule: MicroAppModule = {
  routeConfig,
};

export default microAppModule;
```

### 2. Use MicroLink for Navigation

```tsx
import { MicroLink } from "@mf-hub/router";

function Navigation() {
  return (
    <nav>
      <MicroLink to="/">Home</MicroLink>
      <MicroLink to="/info">Info</MicroLink>
    </nav>
  );
}
```

## API Reference

### Route Configuration

#### defineRoutes

Create a route configuration object for your micro-app.

```typescript
function defineRoutes(config: MicroAppRouteConfig): MicroAppRouteConfig;

interface MicroAppRouteConfig {
  routes: MicroRoute[];
  layout?: ComponentType<{ children: ReactNode }>;
  errorBoundary?: ComponentType<{ error: Error }>;
  notFoundComponent?: ComponentType;
}
```

**Example:**

```typescript
import { defineRoutes } from "@mf-hub/router";

export const routeConfig = defineRoutes({
  routes: [
    { path: "/", component: HomePage },
    { path: "/about", component: AboutPage },
    {
      path: "/items/:id",
      component: ItemPage,
      loader: async () => fetchItems(),
    },
  ],
  layout: AppLayout,
  notFoundComponent: NotFoundPage,
  errorBoundary: ErrorPage,
});
```

#### defineRoute

Helper to create a single route definition (for type safety).

```typescript
function defineRoute(route: MicroRoute): MicroRoute;

interface MicroRoute {
  path: string;
  component: ComponentType;
  children?: MicroRoute[];
  loader?: () => Promise<unknown> | unknown;
  errorComponent?: ComponentType<{ error: Error }>;
  pendingComponent?: ComponentType;
}
```

**Example:**

```typescript
import { defineRoute } from "@mf-hub/router";

const infoRoute = defineRoute({
  path: "/info",
  component: InfoPage,
  loader: async () => {
    const data = await fetchInfo();
    return data;
  },
  pendingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
});
```

### Components

#### MicroAppRenderer

Renders a micro-app with its route configuration. Used by the container to mount micro-apps.

```typescript
interface MicroAppRendererProps {
  basePath: string;
  routeConfig: MicroAppRouteConfig;
  fallback?: ReactNode;
  initialPath?: string;
  useBrowserHistory?: boolean; // default: true
  containerProps?: Record<string, unknown>;
}
```

**Example (Container):**

```tsx
import { MicroAppRenderer } from "@mf-hub/router";

function RemoteApp({ routeConfig }) {
  return (
    <MicroAppRenderer
      basePath="/apps/demo-app"
      routeConfig={routeConfig}
      useBrowserHistory={true}
      fallback={<LoadingSpinner />}
    />
  );
}
```

**Example (Standalone):**

```tsx
import { MicroAppRenderer } from "@mf-hub/router";
import { routeConfig } from "./routes";

// In standalone mode, use basePath="/"
createRoot(document.getElementById("root")!).render(
  <MicroAppRenderer
    basePath="/"
    routeConfig={routeConfig}
    useBrowserHistory={true}
  />
);
```

#### MicroLink

A Link component that automatically handles basepath resolution.

```typescript
interface MicroLinkProps extends Omit<TanStackLinkProps, "to"> {
  to: string;
  absolute?: boolean; // bypass basepath resolution
}
```

**Example:**

```tsx
import { MicroLink } from "@mf-hub/router";

function Navigation() {
  return (
    <nav>
      {/* Relative to basepath */}
      <MicroLink to="/">Home</MicroLink>
      <MicroLink to="/info">Info</MicroLink>

      {/* Absolute path (bypasses basepath) */}
      <MicroLink to="/" absolute>
        Container Home
      </MicroLink>

      {/* With styling */}
      <MicroLink to="/settings" className="text-blue-500 hover:underline">
        Settings
      </MicroLink>
    </nav>
  );
}
```

### Hooks

#### useBasePath

Access the basepath context within a micro-app.

```typescript
function useBasePath(): BasePathContextValue;

interface BasePathContextValue {
  basePath: string;
  resolvePath: (relativePath: string) => string;
}
```

**Example:**

```tsx
import { useBasePath } from "@mf-hub/router";

function CurrentPath() {
  const { basePath, resolvePath } = useBasePath();

  return (
    <div>
      <p>Base path: {basePath}</p>
      <p>Resolved /info: {resolvePath("/info")}</p>
    </div>
  );
}
// In container: basePath="/apps/demo-app", resolvePath("/info")="/apps/demo-app/info"
// Standalone: basePath="/", resolvePath("/info")="/info"
```

#### useIsEmbedded

Check if the micro-app is running inside the container.

```typescript
function useIsEmbedded(): boolean;
```

**Example:**

```tsx
import { useIsEmbedded } from "@mf-hub/router";

function Header() {
  const isEmbedded = useIsEmbedded();

  if (isEmbedded) {
    return null; // Container provides header
  }

  return (
    <header>
      <h1>My App (Standalone)</h1>
    </header>
  );
}
```

#### useMicroNavigate

Programmatic navigation with basepath handling.

```typescript
function useMicroNavigate(): (to: string, options?: NavigateOptions) => void;

interface NavigateOptions {
  replace?: boolean; // Replace history entry
  absolute?: boolean; // Bypass basepath
}
```

**Example:**

```tsx
import { useMicroNavigate } from "@mf-hub/router";

function LoginForm() {
  const navigate = useMicroNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  const goToContainerHome = () => {
    navigate("/", { absolute: true });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### useMicroLocation

Get current location information.

```typescript
function useMicroLocation(): {
  basePath: string;
};
```

### Re-exported TanStack Router Utilities

For convenience, common TanStack Router utilities are re-exported:

```typescript
export {
  Outlet,
  useParams,
  useSearch,
  useLoaderData,
  useRouterState,
  useMatch,
} from "@tanstack/react-router";
```

**Example:**

```tsx
import { useParams, useLoaderData, Outlet } from "@mf-hub/router";

function ItemPage() {
  const { id } = useParams({ from: "/items/$id" });
  const data = useLoaderData({ from: "/items/$id" });

  return (
    <div>
      <h1>Item {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Outlet /> {/* Render child routes */}
    </div>
  );
}
```

### Context Providers

#### BasePathProvider

Provides basepath context to child components. This is automatically used by `MicroAppRenderer`, but can be used directly if needed.

```typescript
interface BasePathProviderProps {
  basePath: string;
  children: ReactNode;
}
```

**Example:**

```tsx
import { BasePathProvider, MicroLink } from "@mf-hub/router";

// Usually not needed directly - MicroAppRenderer handles this
function CustomRenderer({ children }) {
  return (
    <BasePathProvider basePath="/apps/my-app">{children}</BasePathProvider>
  );
}
```

### Router Creation

#### createMicroRouter

Create a TanStack Router instance for a micro-app. This is used internally by `MicroAppRenderer`.

```typescript
interface CreateMicroRouterOptions {
  config: MicroAppRouteConfig;
  basePath: string;
  initialPath?: string;
  useBrowserHistory?: boolean; // default: true
}

function createMicroRouter(options: CreateMicroRouterOptions): Router;
```

**Example:**

```typescript
import { createMicroRouter } from "@mf-hub/router";

const router = createMicroRouter({
  config: routeConfig,
  basePath: "/apps/demo-app",
  initialPath: "/info",
  useBrowserHistory: true,
});
```

## Types

### MicroAppModule

The shape that micro-apps must export for the container to consume.

```typescript
interface MicroAppModule {
  routeConfig: MicroAppRouteConfig;
  init?: (props: MicroAppProps) => Promise<void> | void;
}

interface MicroAppProps {
  basePath: string;
  containerProps?: Record<string, unknown>;
}
```

**Example:**

```typescript
// routes.ts
import { defineRoutes, type MicroAppModule } from "@mf-hub/router";

export const routeConfig = defineRoutes({ routes: [...] });

const microAppModule: MicroAppModule = {
  routeConfig,
  init: async (props) => {
    console.log(`Mounted at: ${props.basePath}`);
    // Initialize analytics, fetch initial data, etc.
  },
};

export default microAppModule;
```

## Complete Example

### routes.ts

```typescript
import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import App from "./App";
import InfoPage from "./pages/InfoPage";
import SettingsPage from "./pages/SettingsPage";
import ItemPage from "./pages/ItemPage";
import NotFoundPage from "./pages/NotFoundPage";
import AppLayout from "./layouts/AppLayout";

export const routeConfig = defineRoutes({
  routes: [
    { path: "/", component: App },
    { path: "/info", component: InfoPage },
    { path: "/settings", component: SettingsPage },
    {
      path: "/items/:id",
      component: ItemPage,
      loader: async ({ params }) => fetchItem(params.id),
    },
  ],
  layout: AppLayout,
  notFoundComponent: NotFoundPage,
});

const microAppModule: MicroAppModule = {
  routeConfig,
  init: async ({ basePath }) => {
    console.log(`App initialized at ${basePath}`);
  },
};

export default microAppModule;
```

### App.tsx

```tsx
import { MicroLink, useIsEmbedded, useBasePath } from "@mf-hub/router";
import { Button, Card, CardContent } from "@mf-hub/ui";

export default function App() {
  const isEmbedded = useIsEmbedded();
  const { basePath } = useBasePath();

  return (
    <Card>
      <CardContent>
        <h1>Welcome!</h1>
        <p>
          Running {isEmbedded ? "embedded" : "standalone"} at {basePath}
        </p>

        <nav>
          <MicroLink to="/info">
            <Button>Info</Button>
          </MicroLink>
          <MicroLink to="/settings">
            <Button variant="outline">Settings</Button>
          </MicroLink>
        </nav>
      </CardContent>
    </Card>
  );
}
```

### pages/InfoPage.tsx

```tsx
import { MicroLink, useMicroNavigate } from "@mf-hub/router";
import { Button, ArrowLeft } from "@mf-hub/ui";

export default function InfoPage() {
  const navigate = useMicroNavigate();

  return (
    <div>
      <MicroLink to="/">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </MicroLink>

      <h1>Info Page</h1>
      <p>This page demonstrates micro-app routing.</p>

      <Button onClick={() => navigate("/settings")}>Go to Settings</Button>
    </div>
  );
}
```

## Browser History Modes

### useBrowserHistory: true (Default)

- URLs update in the browser (e.g., `/apps/demo-app/info`)
- Enables deep linking and browser back/forward
- Used when running in the container

### useBrowserHistory: false

- Uses memory history (URL doesn't change)
- Micro-app routing is isolated
- Useful for modal-like micro-apps or testing

## Basepath Resolution

| Mode       | basePath         | Input               | Output                |
| ---------- | ---------------- | ------------------- | --------------------- |
| Embedded   | `/apps/demo-app` | `/info`             | `/apps/demo-app/info` |
| Standalone | `/`              | `/info`             | `/info`               |
| Absolute   | any              | `/` (absolute=true) | `/`                   |
