import type {
  RemoteConfig,
  LoadRemoteResult,
  LoadRemoteOptions,
  RemoteAppDescriptor,
  BundlerType,
} from "./types";
import { getRemoteConfig, hasRemote, updateRemoteStatus } from "./registry";

/**
 * Type for the Module Federation loadRemote function
 * This is the unified API from @module-federation/enhanced/runtime
 * Uses a loose typing to be compatible with different versions of the runtime
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MFLoadRemote = (
  id: string,
  options?: Record<string, any>,
) => Promise<any>;

/**
 * Type for registering remotes dynamically
 */
export interface MFRemoteInfo {
  name: string;
  entry: string;
  type?: "esm" | "global" | "system";
}

/**
 * Type for the registerRemotes function from @module-federation/enhanced/runtime
 */
export type MFRegisterRemotes = (
  remotes: MFRemoteInfo[],
  options?: { force?: boolean },
) => void;

// Runtime methods - set by initFederation
let mfLoadRemote: MFLoadRemote | null = null;
let mfRegisterRemotes: MFRegisterRemotes | null = null;

/**
 * Configuration for initializing the federation loader
 */
export interface FederationConfig {
  loadRemote: MFLoadRemote;
  registerRemotes?: MFRegisterRemotes;
}

/**
 * Initialize the loader with Module Federation runtime methods
 * Call this from your container's bootstrap.tsx after initializing @module-federation/enhanced
 *
 * @example
 * ```ts
 * import { init, loadRemote, registerRemotes } from "@module-federation/enhanced/runtime";
 * import { initFederation } from "@mf-hub/loader";
 *
 * init({
 *   name: "container",
 *   remotes: [],
 *   shared: { ... }
 * });
 *
 * initFederation({
 *   loadRemote,
 *   registerRemotes,
 * });
 * ```
 */
export const initFederation = (config: FederationConfig): void => {
  mfLoadRemote = config.loadRemote;
  mfRegisterRemotes = config.registerRemotes ?? null;
};

/**
 * Check if federation is initialized
 */
export const isFederationInitialized = (): boolean => {
  return mfLoadRemote !== null;
};

// Cache for loaded modules
const moduleCache = new Map<string, unknown>();

// Track registered remotes to avoid re-registering
const registeredRemotes = new Map<string, string>();

/**
 * Default options for loading remotes
 */
const defaultOptions: Required<LoadRemoteOptions> = {
  timeout: 10000,
  retries: 0,
  retryDelay: 1000,
};

/**
 * Create a promise that rejects after a timeout
 */
const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(new Error(`Remote loading timed out after ${ms}ms`)),
      ms,
    );
  });
};

/**
 * Delay execution for a specified duration
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Build the remote entry URL from a base URL
 * Vite puts remoteEntry.js at root, Webpack puts it in /assets/
 */
const buildRemoteEntryUrl = (
  baseUrl: string,
  bundler: BundlerType = "vite",
): string => {
  const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (bundler === "webpack") {
    return `${cleanUrl}/assets/remoteEntry.js`;
  }
  return `${cleanUrl}/remoteEntry.js`;
};

/**
 * Register a remote dynamically with the Module Federation runtime
 */
const ensureRemoteRegistered = (
  scope: string,
  url: string,
  bundler: BundlerType = "vite",
): void => {
  const entryUrl = buildRemoteEntryUrl(url, bundler);

  // Check if already registered with the same URL
  if (registeredRemotes.get(scope) === entryUrl) {
    return;
  }

  // For dynamic registration, we need to use registerRemotes if available
  // Otherwise, we'll rely on the loadRemote handling it via the entry URL
  if (mfRegisterRemotes) {
    mfRegisterRemotes(
      [
        {
          name: scope,
          entry: entryUrl,
          // Both Vite and Webpack use 'global' type when served from remoteEntry.js
          type: bundler === "webpack" ? "global" : "esm",
        },
      ],
      { force: true },
    );
  }

  registeredRemotes.set(scope, entryUrl);
};

/**
 * Load a remote module by name (must be registered first)
 */
export const loadRemote = async <T = unknown>(
  remoteName: string,
  options: LoadRemoteOptions = {},
): Promise<LoadRemoteResult<T>> => {
  const config = getRemoteConfig(remoteName);

  if (!config) {
    return {
      success: false,
      error: new Error(`Remote "${remoteName}" is not registered`),
    };
  }

  return loadRemoteByConfig<T>(config, options);
};

/**
 * Load a remote module by configuration
 * Uses the unified @module-federation/enhanced runtime API
 * Works with both Vite and Webpack remotes transparently
 */
export const loadRemoteByConfig = async <T = unknown>(
  config: RemoteConfig,
  options: LoadRemoteOptions = {},
): Promise<LoadRemoteResult<T>> => {
  const opts = { ...defaultOptions, ...options };
  const { scope, url, module = "./routes", name, bundler = "vite" } = config;
  const cacheKey = `${scope}:${module}`;

  // Check module cache
  if (moduleCache.has(cacheKey)) {
    return {
      success: true,
      module: moduleCache.get(cacheKey) as T,
    };
  }

  // Update status if registered
  if (hasRemote(name)) {
    updateRemoteStatus(name, "loading");
  }

  if (!mfLoadRemote) {
    return {
      success: false,
      error: new Error(
        "Federation not initialized. Call initFederation() first.",
      ),
    };
  }

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    try {
      // Register the remote dynamically
      ensureRemoteRegistered(scope, url, bundler);

      // Use Module Federation's unified loadRemote API
      // Format: "scope/module" (e.g., "demoApp/routes")
      const moduleId = `${scope}${module.startsWith("./") ? module.slice(1) : `/${module}`}`;

      const loadPromise = mfLoadRemote(moduleId, {
        from: "runtime",
      }) as Promise<T>;

      const result = await Promise.race([
        loadPromise,
        createTimeout(opts.timeout),
      ]);

      if (result === null) {
        throw new Error(
          `Failed to load module "${moduleId}": module returned null`,
        );
      }

      // Cache the result
      moduleCache.set(cacheKey, result);

      // Update status if registered
      if (hasRemote(name)) {
        updateRemoteStatus(name, "loaded");
      }

      return { success: true, module: result };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < opts.retries) {
        await delay(opts.retryDelay);
      }
    }
  }

  // Update status if registered
  if (hasRemote(name)) {
    updateRemoteStatus(name, "error", lastError);
  }

  return { success: false, error: lastError };
};

/**
 * Load a remote module directly by URL (no registry required)
 * This is the simplest way to load a remote when you have the URL from an API
 */
export const loadRemoteByUrl = async <T = unknown>(
  url: string,
  scope: string,
  module: string = "./App",
  options: LoadRemoteOptions = {},
  bundler: BundlerType = "vite",
): Promise<LoadRemoteResult<T>> => {
  // Create an ephemeral config for the loader
  const config: RemoteConfig = {
    name: `dynamic_${scope}_${Date.now()}`,
    url,
    scope,
    module,
    bundler,
  };

  return loadRemoteByConfig<T>(config, options);
};

/**
 * Load a remote module from an API descriptor
 * Useful when your API returns RemoteAppDescriptor objects
 */
export const loadRemoteByDescriptor = async <T = unknown>(
  descriptor: RemoteAppDescriptor,
  options: LoadRemoteOptions = {},
): Promise<LoadRemoteResult<T>> => {
  // Create an ephemeral config for the loader
  const config: RemoteConfig = {
    name: `dynamic_${descriptor.scope}_${Date.now()}`,
    url: descriptor.url,
    scope: descriptor.scope,
    module: descriptor.module,
    bundler: descriptor.bundler,
  };

  return loadRemoteByConfig<T>(config, options);
};

/**
 * Preload a remote module without blocking
 */
export const preloadRemote = (
  remoteName: string,
  options: LoadRemoteOptions = {},
): void => {
  loadRemote(remoteName, options).catch(() => {
    // Silently handle preload failures
  });
};

/**
 * Clear the module cache for a specific remote or all remotes
 */
export const clearModuleCache = (scope?: string): void => {
  if (scope) {
    for (const key of moduleCache.keys()) {
      if (key.startsWith(`${scope}:`)) {
        moduleCache.delete(key);
      }
    }
    registeredRemotes.delete(scope);
  } else {
    moduleCache.clear();
    registeredRemotes.clear();
  }
};
