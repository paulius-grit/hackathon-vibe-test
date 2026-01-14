# MF Hub Architecture

This document explains the concepts, approaches, and architecture used in the MF Hub (Module Federation Hub) project.

## Overview

MF Hub is a micro-frontend platform that enables:

- **Dynamic loading** of remote applications at runtime
- **Shared dependencies** (React, TanStack Router) across all micro-apps
- **Browser URL synchronization** with micro-app navigation
- **Standalone development** mode for individual micro-apps
- **Centralized configuration** via an Admin API

## Core Concepts

### Module Federation

Module Federation is a Webpack/Vite feature that allows JavaScript applications to dynamically load code from other applications at runtime. In MF Hub:

- **Container (Host)**: The main application that loads and orchestrates micro-apps
- **Remotes (Micro-apps)**: Independent applications that expose modules to be consumed
- **Shared Modules**: Dependencies shared across apps to avoid duplication (React, Router, etc.)

```
┌─────────────────────────────────────────────────────────────┐
│                        Container                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Shell (Layout)                    │    │
│  │  ┌──────────┐  ┌────────────────────────────────┐   │    │
│  │  │ Sidebar  │  │      Micro-app Area            │   │    │
│  │  │          │  │  ┌──────────────────────────┐  │   │    │
│  │  │ - Home   │  │  │   Dynamically Loaded     │  │   │    │
│  │  │ - App 1  │  │  │   Remote Application     │  │   │    │
│  │  │ - App 2  │  │  │                          │  │   │    │
│  │  │          │  │  └──────────────────────────┘  │   │    │
│  │  └──────────┘  └────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Dynamic Remote Loading

Unlike traditional Module Federation where remotes are statically configured, MF Hub loads remotes **dynamically at runtime**:

1. Container fetches remote app configurations from the Admin API
2. When a user navigates to an app, the loader registers the remote
3. The remote's `remoteEntry.js` is fetched and executed
4. Share scope negotiation ensures shared dependencies are used
5. The exposed module (`./routes`) is loaded and rendered

```typescript
// Dynamic loading flow
const remotes = await fetch("/api/remotes"); // Get from Admin API
const { loadRemoteByUrl } = await import("@mf-hub/loader");
const module = await loadRemoteByUrl(remote.url, remote.scope, "./routes");
```

### Routing Architecture

MF Hub uses a **dual-router architecture**:

1. **Container Router** (TanStack Router with file-based routing)
   - Manages top-level navigation (`/`, `/apps/$name/$`)
   - Uses browser history
   - Provides the Shell layout

2. **Micro-app Router** (TanStack Router with code-based routing)
   - Each micro-app has its own router instance
   - Uses browser history with basepath (e.g., `/apps/demo-app`)
   - Routes are defined in `routes.ts` using `defineRoutes()`

```
URL: /apps/demo-app/info

Container Router:             Micro-app Router:
├── /                         ├── /          → App.tsx
└── /apps/$name/$   ←match→   ├── /info      → InfoPage.tsx  ←match
                              └── /settings  → SettingsPage.tsx
```

### Basepath Handling

When a micro-app is embedded in the container, it operates under a basepath:

```
Standalone mode:  /info  →  /info
Embedded mode:    /info  →  /apps/demo-app/info
```

The `@mf-hub/router` library handles this automatically:

- `MicroLink` resolves paths relative to the basepath
- `useMicroNavigate()` handles programmatic navigation
- `useBasePath()` provides the current basepath context

## Project Structure

```
mf-hub/
├── apps/
│   ├── container/          # Main host application
│   ├── demo-app/           # Example micro-app
│   └── calendar-app/       # Example micro-app
├── libraries/
│   ├── loader/             # Dynamic remote loading utilities
│   ├── router/             # Micro-app routing utilities
│   └── ui/                 # Shared UI components
├── services/
│   └── admin-api/          # Configuration management API
└── pnpm-workspace.yaml     # Monorepo configuration
```

## Key Libraries

### @mf-hub/loader

Handles dynamic loading of remote modules:

- `initFederation()` - Initialize with federation methods from container
- `loadRemoteByUrl()` - Load a remote by URL (most common)
- `loadRemoteByConfig()` - Load using a registry config
- Module caching and status tracking

### @mf-hub/router

Provides routing utilities for micro-apps:

- `defineRoutes()` - Define route configuration
- `MicroAppRenderer` - Render micro-app with routing
- `MicroLink` - Basepath-aware Link component
- `useBasePath()` - Access basepath context
- `useMicroNavigate()` - Programmatic navigation

### @mf-hub/ui

Shared UI component library:

- Common components (Button, Card, Badge, etc.)
- Consistent styling via Tailwind CSS
- Icon re-exports from Lucide
- `NotFoundPage` for consistent 404 handling

## Data Flow

### App Configuration Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Admin API   │────►│   Container  │────►│   Sidebar    │
│  /api/remotes│     │   Context    │     │   Menu       │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ RemoteLoader │
                     │  Component   │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  @mf-hub/    │
                     │   loader     │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Remote     │
                     │  Entry.js    │
                     └──────────────┘
```

### Navigation Flow

```
User clicks sidebar      Container navigates to       RemoteLoader fetches
link "Demo App"    ────► /apps/demo-app        ────►  & renders micro-app
        │
        ▼
User clicks link         Micro-app router            URL updates to
"/info" in micro-app ──► navigates (basepath-aware) ──► /apps/demo-app/info
```

## Share Scope Management

A critical aspect of Module Federation is ensuring shared dependencies use the same instance:

```typescript
// Container vite.config.ts
federation({
  name: "container",
  remotes: {
    // Placeholder remote to trigger share scope generation
    __placeholder__: { ... }
  },
  shared: ["react", "react-dom", "@tanstack/react-router"],
})

// Micro-app vite.config.ts
federation({
  name: "demo-app",
  exposes: { "./routes": "./src/routes.ts" },
  shared: ["react", "react-dom", "@tanstack/react-router"],
})
```

This ensures:

- Single React instance (prevents hook errors)
- Single Router instance (enables basepath sharing)
- Smaller bundle sizes (shared modules loaded once)

## Federation Initialization

The container must initialize the loader with federation methods:

```typescript
// apps/container/src/bootstrap.tsx
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
  __federation_method_ensure,
} from "virtual:__federation__";
import { initFederation } from "@mf-hub/loader";

// Initialize before any remote loading
initFederation({
  setRemote: __federation_method_setRemote,
  getRemote: __federation_method_getRemote,
  unwrapDefault: __federation_method_unwrapDefault,
  ensure: __federation_method_ensure,
});
```

## Splat Route Pattern

The container uses a "splat route" to capture all sub-paths within micro-apps:

```
Route: /apps/$name/$

Matches:
- /apps/demo-app         → name="demo-app", _splat=""
- /apps/demo-app/info    → name="demo-app", _splat="info"
- /apps/demo-app/a/b/c   → name="demo-app", _splat="a/b/c"
```

The splat value is passed to the micro-app as the initial path, enabling deep linking.

## Standalone vs Embedded Mode

Micro-apps can run in two modes:

### Standalone Mode

- App runs independently at `localhost:3001`
- Uses browser history at root (`/`)
- Great for development and testing
- Entry point: `src/bootstrap.tsx`

### Embedded Mode

- App is loaded by container
- Uses browser history with basepath (`/apps/{name}`)
- URLs reflect micro-app navigation
- Entry point: `src/routes.ts` (exposed via federation)

```typescript
// Detecting the mode
import { useIsEmbedded } from "@mf-hub/router";

function MyComponent() {
  const isEmbedded = useIsEmbedded();
  // true when running in container, false when standalone
}
```

## Error Handling

### Loading Errors

The `RemoteLoader` component handles:

- Network failures
- Invalid module exports
- Timeout errors

### Routing Errors

Each micro-app can define:

- `notFoundComponent` for 404s within the app
- `errorBoundary` for runtime errors

### Container 404

The container's root route defines a `notFoundComponent` for unknown routes.

## Performance Considerations

1. **Module Caching**: Loaded modules are cached to prevent re-fetching
2. **Lazy Loading**: Micro-apps are only loaded when navigated to
3. **Shared Dependencies**: Common libraries are loaded once and shared
4. **Preloading**: `preloadRemote()` can warm up the cache for anticipated navigation

## Security Considerations

1. **CORS**: Micro-apps must enable CORS for cross-origin loading
2. **CSP**: Content Security Policy may need adjustment for dynamic script loading
3. **API Access**: Admin API should be protected in production

## Future Enhancements

Potential improvements to consider:

- Authentication/authorization integration
- Version management for micro-apps
- A/B testing support
- Performance monitoring
- Build-time federation analysis
