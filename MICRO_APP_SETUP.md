# Micro App Setup Guide

This guide explains how to create a micro-app that can be loaded by the MF Hub container.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Basic knowledge of React and TypeScript

## Quick Start

### 1. Create Your App Structure

```
my-micro-app/
├── src/
│   ├── components/
│   │   └── MicroNotFoundPage.tsx
│   ├── pages/
│   │   └── InfoPage.tsx
│   ├── App.tsx
│   ├── routes.ts          # ← Required: Route configuration
│   ├── bootstrap.tsx      # Standalone entry point
│   ├── main.tsx           # Module Federation async boundary
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

### 2. Install Dependencies

```json
{
  "dependencies": {
    "@mf-hub/router": "workspace:*",
    "@mf-hub/ui": "workspace:*",
    "@tanstack/react-router": "^1.45.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.5",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 3. Configure Vite for Module Federation

Create `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      // Unique name for your micro-app
      name: "my-micro-app",
      filename: "remoteEntry.js",

      // Expose your routes module
      exposes: {
        "./routes": "./src/routes.ts",
      },

      // CRITICAL: Share these dependencies as singletons
      shared: ["react", "react-dom", "@tanstack/react-router"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001, // Choose a unique port
    strictPort: true,
    cors: true, // Required for cross-origin loading
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
});
```

### 4. Create Your Route Configuration

This is the **most important file** - it defines what the container will load.

Create `src/routes.ts`:

```typescript
import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import App from "./App";
import InfoPage from "./pages/InfoPage";
import { MicroNotFoundPage } from "./components/MicroNotFoundPage";

/**
 * Route configuration for your micro-app
 */
export const routeConfig = defineRoutes({
  routes: [
    {
      path: "/",
      component: App,
    },
    {
      path: "/info",
      component: InfoPage,
    },
    // Add more routes as needed
    {
      path: "/settings",
      component: SettingsPage,
    },
  ],
  // Optional: Custom 404 page
  notFoundComponent: MicroNotFoundPage,
  // Optional: Layout that wraps all routes
  // layout: AppLayout,
  // Optional: Global error boundary
  // errorBoundary: ErrorBoundary,
});

/**
 * Default export as MicroAppModule
 * The container expects this shape
 */
const microAppModule: MicroAppModule = {
  routeConfig,
  // Optional: Initialization function
  // init: async (props) => {
  //   console.log("Micro-app mounted at:", props.basePath);
  // },
};

export default microAppModule;
```

### 5. Create Page Components

Create your page components using the `@mf-hub/router` utilities:

```tsx
// src/App.tsx
import { MicroLink } from "@mf-hub/router";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@mf-hub/ui";

export default function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Micro App</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to my micro-app!</p>

        {/* Use MicroLink for navigation within your app */}
        <MicroLink to="/info">
          <Button>Go to Info Page</Button>
        </MicroLink>
      </CardContent>
    </Card>
  );
}
```

```tsx
// src/pages/InfoPage.tsx
import { MicroLink, useBasePath } from "@mf-hub/router";
import { Button, ArrowLeft } from "@mf-hub/ui";

export default function InfoPage() {
  const { basePath } = useBasePath();

  return (
    <div>
      <MicroLink to="/">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </MicroLink>

      <h1>Info Page</h1>
      <p>Current base path: {basePath}</p>
    </div>
  );
}
```

### 6. Create 404 Page Component

```tsx
// src/components/MicroNotFoundPage.tsx
import { NotFoundPage } from "@mf-hub/ui";
import { MicroLink, useBasePath } from "@mf-hub/router";

export function MicroNotFoundPage() {
  const { basePath } = useBasePath();

  return (
    <NotFoundPage
      path={basePath}
      LinkComponent={MicroLink}
      onBackClick={() => window.history.back()}
    />
  );
}
```

### 7. Setup Entry Points

Create the async boundary for Module Federation:

```tsx
// src/main.tsx
// Async entry point - creates the boundary needed for shared module negotiation
import("./bootstrap");
```

```tsx
// src/bootstrap.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MicroAppRenderer } from "@mf-hub/router";
import { routeConfig } from "./routes";
import "./index.css";

/**
 * Standalone entry point for development.
 * When loaded via Module Federation, only routes.ts is used.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <div className="min-h-screen">
      <div className="p-4 border-b bg-muted/30">
        <p className="text-sm text-muted-foreground">
          ⚡ Running in standalone mode
        </p>
      </div>
      <MicroAppRenderer
        basePath="/"
        routeConfig={routeConfig}
        useBrowserHistory={true}
      />
    </div>
  </StrictMode>
);
```

### 8. Configure Tailwind CSS

```javascript
// tailwind.config.js
import uiPreset from "@mf-hub/ui/tailwind.preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiPreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../libraries/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
```

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 9. Import Global Styles

```css
/* src/index.css */
@import "@mf-hub/ui/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Running Your Micro-App

### Standalone Development

```bash
pnpm dev
```

Your app runs independently at `http://localhost:3001` (or your configured port).

### Build for Production

```bash
pnpm build
pnpm preview
```

This builds and serves your app with the Module Federation `remoteEntry.js` available.

## Integrating with the Container

Once your micro-app is running, add it to the container via the Admin API:

```bash
curl -X POST http://localhost:4000/api/remotes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-micro-app",
    "url": "http://localhost:3001",
    "scope": "my-micro-app",
    "title": "My Micro App",
    "icon": "Package"
  }'
```

## Navigation Within Your App

### Using MicroLink Component

```tsx
import { MicroLink } from "@mf-hub/router";

// Navigate within your micro-app (relative to basepath)
<MicroLink to="/info">Go to Info</MicroLink>

// Navigate to absolute path (bypass basepath)
<MicroLink to="/" absolute>Go to Container Home</MicroLink>
```

### Programmatic Navigation

```tsx
import { useMicroNavigate } from "@mf-hub/router";

function MyComponent() {
  const navigate = useMicroNavigate();

  const handleClick = () => {
    navigate("/info");
  };

  return <button onClick={handleClick}>Navigate</button>;
}
```

## Checking Embedded Mode

```tsx
import { useIsEmbedded, useBasePath } from "@mf-hub/router";

function MyComponent() {
  const isEmbedded = useIsEmbedded();
  const { basePath } = useBasePath();

  if (isEmbedded) {
    return <p>Running inside container at {basePath}</p>;
  }

  return <p>Running in standalone mode</p>;
}
```

## Route Configuration Options

```typescript
interface MicroRoute {
  path: string; // Route path (e.g., "/", "/info", "/items/:id")
  component: ComponentType; // React component to render
  children?: MicroRoute[]; // Nested routes
  loader?: () => Promise<unknown>; // Data loader function
  errorComponent?: ComponentType; // Error boundary for this route
  pendingComponent?: ComponentType; // Loading component
}

interface MicroAppRouteConfig {
  routes: MicroRoute[]; // Array of routes
  layout?: ComponentType; // Root layout wrapper
  errorBoundary?: ComponentType; // Global error boundary
  notFoundComponent?: ComponentType; // 404 page component
}
```

## Best Practices

1. **Always use `MicroLink`** for navigation within your micro-app
2. **Share dependencies** in `vite.config.ts` to avoid duplicate React instances
3. **Use unique ports** for each micro-app during development
4. **Enable CORS** in your Vite config
5. **Use the `@mf-hub/ui` components** for consistent styling
6. **Implement a 404 page** using the shared `NotFoundPage` component
7. **Test in standalone mode** before integrating with the container

## Troubleshooting

### "Cannot read properties of null (reading 'useRef')"

This error indicates multiple React instances. Ensure:

- `shared: ["react", "react-dom", "@tanstack/react-router"]` is in your Vite config
- You're not importing React directly in some places

### "Remote loading timed out"

Check that:

- Your micro-app is running and accessible
- CORS is enabled in your Vite config
- The URL in the Admin API matches your server

### Styles not loading

Ensure:

- You're importing `@mf-hub/ui/globals.css` in your CSS
- The UI library path is in your Tailwind `content` array
