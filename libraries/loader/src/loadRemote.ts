import type {
  RemoteConfig,
  LoadRemoteResult,
  LoadRemoteOptions,
  RemoteAppDescriptor,
} from "./types";
import {
  getRemoteConfig,
  hasRemote,
  updateRemoteStatus,
} from "./registry";

// Config type for federation remote
export interface FederationRemoteConfig {
  url: (() => Promise<string>) | string;
  format: "esm" | "systemjs" | "var";
  from: "vite" | "webpack";
}

// Types for federation methods that will be provided by the container
export interface FederationMethods {
  setRemote: (name: string, config: FederationRemoteConfig) => void;
  getRemote: (scope: string, module: string) => Promise<unknown>;
  unwrapDefault: (module: unknown) => unknown;
  ensure: (remoteName: string) => Promise<unknown>;
}

// Federation methods - must be set by the consuming app
let federationMethods: FederationMethods | null = null;

/**
 * Initialize the loader with federation methods from the container app
 * Call this from your container's bootstrap.tsx after importing from virtual:__federation__
 * 
 * @example
 * ```ts
 * import { 
 *   __federation_method_setRemote,
 *   __federation_method_getRemote, 
 *   __federation_method_unwrapDefault 
 * } from "virtual:__federation__";
 * import { initFederation } from "@mf-hub/loader";
 * 
 * initFederation({
 *   setRemote: __federation_method_setRemote,
 *   getRemote: __federation_method_getRemote,
 *   unwrapDefault: __federation_method_unwrapDefault,
 * });
 * ```
 */
export const initFederation = (methods: FederationMethods): void => {
  federationMethods = methods;
};

/**
 * Check if federation is initialized
 */
export const isFederationInitialized = (): boolean => {
  return federationMethods !== null;
};

// Cache for loaded modules
const moduleCache = new Map<string, unknown>();

// Track registered remotes to avoid re-registering
const registeredRemotes = new Set<string>();

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
    setTimeout(() => reject(new Error(`Remote loading timed out after ${ms}ms`)), ms);
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
 * Vite plugin federation puts remoteEntry.js in /assets/
 */
const buildRemoteEntryUrl = (baseUrl: string): string => {
  const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanUrl}/assets/remoteEntry.js`;
};

/**
 * Register a remote with the federation runtime
 */
const ensureRemoteRegistered = (name: string, url: string): void => {
  if (!federationMethods) {
    throw new Error("Federation not initialized. Call initFederation() first.");
  }
  
  if (registeredRemotes.has(name)) {
    return;
  }
  
  federationMethods.setRemote(name, {
    url: buildRemoteEntryUrl(url),
    format: "esm",
    from: "vite",
  });
  
  registeredRemotes.add(name);
};

/**
 * Load a remote module by name (must be registered first)
 */
export const loadRemote = async <T = unknown>(
  remoteName: string,
  options: LoadRemoteOptions = {}
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
 * Uses vite-plugin-federation's virtual:__federation__ APIs
 */
export const loadRemoteByConfig = async <T = unknown>(
  config: RemoteConfig,
  options: LoadRemoteOptions = {}
): Promise<LoadRemoteResult<T>> => {
  if (!federationMethods) {
    return {
      success: false,
      error: new Error("Federation not initialized. Call initFederation() first."),
    };
  }

  const opts = { ...defaultOptions, ...options };
  const { scope, url, module = "./App", name } = config;
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

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    try {
      const loadPromise = (async () => {
        // Register the remote with federation runtime
        ensureRemoteRegistered(scope, url);
        
        // Ensure the remote is initialized (loads remoteEntry.js and initializes share scope)
        await federationMethods!.ensure(scope);
        
        // Use federation's getRemote to load the module
        const remoteModule = await federationMethods!.getRemote(scope, module);
        
        // Unwrap the default export
        const unwrapped = federationMethods!.unwrapDefault(remoteModule);
        
        return unwrapped as T;
      })();

      const result = await Promise.race([loadPromise, createTimeout(opts.timeout)]);

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
  options: LoadRemoteOptions = {}
): Promise<LoadRemoteResult<T>> => {
  // Create an ephemeral config for the loader
  const config: RemoteConfig = {
    name: `dynamic_${scope}_${Date.now()}`,
    url,
    scope,
    module,
  };

  return loadRemoteByConfig<T>(config, options);
};

/**
 * Load a remote module from an API descriptor
 * Useful when your API returns RemoteAppDescriptor objects
 */
export const loadRemoteByDescriptor = async <T = unknown>(
  descriptor: RemoteAppDescriptor,
  options: LoadRemoteOptions = {}
): Promise<LoadRemoteResult<T>> => {
  return loadRemoteByUrl<T>(
    descriptor.url,
    descriptor.scope,
    descriptor.module,
    options
  );
};

/**
 * Preload a remote module without blocking
 */
export const preloadRemote = (
  remoteName: string,
  options: LoadRemoteOptions = {}
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
