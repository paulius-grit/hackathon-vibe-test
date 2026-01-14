# @mf-hub/loader

Dynamic remote module loading library for Module Federation micro-frontends.

## Installation

```bash
pnpm add @mf-hub/loader
```

## Overview

This library provides utilities for dynamically loading remote modules at runtime using Vite's Module Federation plugin. It handles:

- Remote registration and loading
- Share scope management
- Module caching
- Status tracking
- Error handling with retries

## Initialization

Before loading any remotes, you must initialize the loader with federation methods from your container app:

```typescript
// In your container's bootstrap.tsx
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
  __federation_method_ensure,
} from "virtual:__federation__";
import { initFederation } from "@mf-hub/loader";

initFederation({
  setRemote: __federation_method_setRemote,
  getRemote: __federation_method_getRemote,
  unwrapDefault: __federation_method_unwrapDefault,
  ensure: __federation_method_ensure,
});
```

## API Reference

### initFederation

Initialize the loader with federation methods from the container.

```typescript
function initFederation(methods: FederationMethods): void;

interface FederationMethods {
  setRemote: (name: string, config: FederationRemoteConfig) => void;
  getRemote: (scope: string, module: string) => Promise<unknown>;
  unwrapDefault: (module: unknown) => unknown;
  ensure: (remoteName: string) => Promise<unknown>;
}
```

**Example:**

```typescript
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
  __federation_method_ensure,
} from "virtual:__federation__";

initFederation({
  setRemote: __federation_method_setRemote,
  getRemote: __federation_method_getRemote,
  unwrapDefault: __federation_method_unwrapDefault,
  ensure: __federation_method_ensure,
});
```

### isFederationInitialized

Check if federation has been initialized.

```typescript
function isFederationInitialized(): boolean;
```

**Example:**

```typescript
if (!isFederationInitialized()) {
  console.error("Federation not initialized!");
}
```

### loadRemoteByUrl

Load a remote module directly by URL. This is the **most common** method when loading remotes dynamically from an API.

```typescript
function loadRemoteByUrl<T = unknown>(
  url: string,
  scope: string,
  module?: string,
  options?: LoadRemoteOptions
): Promise<LoadRemoteResult<T>>;
```

**Parameters:**

- `url` - Base URL where the remote is hosted (e.g., `http://localhost:3001`)
- `scope` - The federation scope name (matches `name` in remote's vite.config.ts)
- `module` - Module to load (default: `"./App"`)
- `options` - Optional loading options

**Example:**

```typescript
import { loadRemoteByUrl } from "@mf-hub/loader";
import type { MicroAppModule } from "@mf-hub/router";

const result = await loadRemoteByUrl<MicroAppModule>(
  "http://localhost:3001",
  "demo-app",
  "./routes"
);

if (result.success) {
  console.log("Loaded routes:", result.module.routeConfig);
} else {
  console.error("Failed to load:", result.error);
}
```

### loadRemoteByConfig

Load a remote module using a configuration object.

```typescript
function loadRemoteByConfig<T = unknown>(
  config: RemoteConfig,
  options?: LoadRemoteOptions
): Promise<LoadRemoteResult<T>>;

interface RemoteConfig {
  name: string; // Unique identifier
  url: string; // Base URL of the remote
  scope: string; // Federation scope name
  module?: string; // Module to load (default: "./App")
}
```

**Example:**

```typescript
const config = {
  name: "demo-app",
  url: "http://localhost:3001",
  scope: "demo-app",
  module: "./routes",
};

const result = await loadRemoteByConfig(config);
```

### loadRemoteByDescriptor

Load a remote module from an API descriptor object.

```typescript
function loadRemoteByDescriptor<T = unknown>(
  descriptor: RemoteAppDescriptor,
  options?: LoadRemoteOptions
): Promise<LoadRemoteResult<T>>;

interface RemoteAppDescriptor {
  url: string;
  scope: string;
  module?: string;
  metadata?: Record<string, unknown>;
}
```

**Example:**

```typescript
// Fetch descriptor from API
const response = await fetch("/api/remotes/demo-app");
const descriptor = await response.json();

const result = await loadRemoteByDescriptor(descriptor);
```

### loadRemote

Load a remote module by name from the registry.

```typescript
function loadRemote<T = unknown>(
  remoteName: string,
  options?: LoadRemoteOptions
): Promise<LoadRemoteResult<T>>;
```

**Example:**

```typescript
// First register the remote
registerRemote({
  name: "demo-app",
  url: "http://localhost:3001",
  scope: "demo-app",
});

// Then load it
const result = await loadRemote("demo-app");
```

### preloadRemote

Preload a remote module without blocking. Useful for warming the cache.

```typescript
function preloadRemote(remoteName: string, options?: LoadRemoteOptions): void;
```

**Example:**

```typescript
// Preload on hover
const handleMouseEnter = () => {
  preloadRemote("demo-app");
};
```

### clearModuleCache

Clear the module cache for a specific remote or all remotes.

```typescript
function clearModuleCache(scope?: string): void;
```

**Example:**

```typescript
// Clear cache for specific remote
clearModuleCache("demo-app");

// Clear all cached modules
clearModuleCache();
```

## Registry Functions

### registerRemote

Register a remote configuration in the registry.

```typescript
function registerRemote(config: RemoteConfig): void;
```

### registerRemotes

Register multiple remotes at once.

```typescript
function registerRemotes(configs: RemoteConfig[]): void;
```

### getRemoteConfig

Get a remote configuration from the registry.

```typescript
function getRemoteConfig(name: string): RemoteConfig | undefined;
```

### getAllRemotes

Get all registered remotes.

```typescript
function getAllRemotes(): RemoteConfig[];
```

### hasRemote

Check if a remote is registered.

```typescript
function hasRemote(name: string): boolean;
```

### unregisterRemote

Remove a remote from the registry.

```typescript
function unregisterRemote(name: string): void;
```

### clearRegistry

Clear all registered remotes.

```typescript
function clearRegistry(): void;
```

### getRemoteState

Get the current state of a remote.

```typescript
function getRemoteState(name: string): RemoteState | undefined;

interface RemoteState {
  status: "idle" | "loading" | "loaded" | "error";
  error?: Error;
  loadedAt?: number;
}
```

### getRemotesByStatus

Get all remotes with a specific status.

```typescript
function getRemotesByStatus(status: RemoteStatus): RemoteConfig[];
```

## Loading Options

```typescript
interface LoadRemoteOptions {
  /** Timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Retry attempts on failure (default: 0) */
  retries?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
}
```

**Example with options:**

```typescript
const result = await loadRemoteByUrl(
  "http://localhost:3001",
  "demo-app",
  "./routes",
  {
    timeout: 5000,
    retries: 3,
    retryDelay: 500,
  }
);
```

## Result Types

```typescript
type LoadRemoteResult<T> =
  | { success: true; module: T }
  | { success: false; error: Error };
```

**Pattern matching:**

```typescript
const result = await loadRemoteByUrl(...);

if (result.success) {
  // TypeScript knows result.module exists
  doSomething(result.module);
} else {
  // TypeScript knows result.error exists
  console.error(result.error.message);
}
```

## Complete Example

```typescript
import {
  initFederation,
  loadRemoteByUrl,
  isFederationInitialized,
  type LoadRemoteResult,
} from "@mf-hub/loader";
import type { MicroAppModule } from "@mf-hub/router";

// Initialize (do this once in your container)
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
  __federation_method_ensure,
} from "virtual:__federation__";

initFederation({
  setRemote: __federation_method_setRemote,
  getRemote: __federation_method_getRemote,
  unwrapDefault: __federation_method_unwrapDefault,
  ensure: __federation_method_ensure,
});

// Load a remote
async function loadMicroApp(url: string, scope: string) {
  if (!isFederationInitialized()) {
    throw new Error("Federation not initialized");
  }

  const result: LoadRemoteResult<MicroAppModule> = await loadRemoteByUrl(
    url,
    scope,
    "./routes",
    { timeout: 10000, retries: 2 }
  );

  if (!result.success) {
    throw result.error;
  }

  // Validate the module shape
  if (!result.module?.routeConfig?.routes) {
    throw new Error("Invalid module: missing routeConfig");
  }

  return result.module;
}
```

## Error Handling

Common errors and solutions:

| Error                            | Cause                         | Solution                                       |
| -------------------------------- | ----------------------------- | ---------------------------------------------- |
| "Federation not initialized"     | `initFederation()` not called | Call `initFederation()` in container bootstrap |
| "Remote loading timed out"       | Network issue or slow server  | Increase timeout, check network                |
| "Failed to fetch remoteEntry.js" | Wrong URL or CORS issue       | Verify URL, enable CORS on remote              |
| "Module not found"               | Wrong module path             | Check `exposes` in remote's vite.config        |
