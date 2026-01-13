import type {
  RemoteConfig,
  RemoteModule,
  LoadRemoteResult,
  LoadRemoteOptions,
  RemoteAppDescriptor,
} from "./types";
import {
  getRemoteConfig,
  hasRemote,
  updateRemoteStatus,
} from "./registry";

// Cache for loaded remote containers
const containerCache = new Map<string, unknown>();

// Cache for loaded modules
const moduleCache = new Map<string, unknown>();

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
 * Remote container interface from vite-plugin-federation
 */
interface FederationContainer {
  init: (shareScope: Record<string, unknown>) => void;
  get: (module: string) => Promise<() => unknown>;
}

/**
 * Shared module registration for the global federation scope
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SharedModuleGetter = () => Promise<any>;

interface SharedModuleConfig {
  name: string;
  version: string;
  getter: SharedModuleGetter;
}

/**
 * Register shared modules in the global federation scope
 * This must be called before loading any remotes
 */
export const registerSharedModules = (modules: SharedModuleConfig[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  
  g.__federation_shared__ = g.__federation_shared__ || {};
  g.__federation_shared__.default = g.__federation_shared__.default || {};
  
  for (const mod of modules) {
    if (!g.__federation_shared__.default[mod.name]) {
      g.__federation_shared__.default[mod.name] = {};
    }
    
    g.__federation_shared__.default[mod.name][mod.version] = {
      get: () => mod.getter().then((m: unknown) => () => m),
      loaded: true,
      from: "host",
      scope: "default",
    };
  }
};

/**
 * Initialize a remote container using dynamic import
 * vite-plugin-federation exports { get, init } from remoteEntry.js
 */
const initializeContainer = async (
  scope: string,
  url: string
): Promise<FederationContainer> => {
  // Check cache first
  if (containerCache.has(scope)) {
    return containerCache.get(scope) as FederationContainer;
  }

  const remoteEntryUrl = buildRemoteEntryUrl(url);

  try {
    // Use dynamic import for ES module remotes
    const container = await import(/* @vite-ignore */ remoteEntryUrl) as FederationContainer;

    if (!container || typeof container.get !== "function") {
      throw new Error(`Remote container "${scope}" does not expose a valid federation interface`);
    }

    // Initialize with empty object - the remote will find shared modules in globalThis.__federation_shared__
    container.init({});

    containerCache.set(scope, container);
    return container;
  } catch (error) {
    throw new Error(
      `Failed to load remote container "${scope}" from ${remoteEntryUrl}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

/**
 * Get a module from an initialized container
 * vite-plugin-federation uses get() which returns a factory function
 */
const getModuleFromContainer = async <T>(
  container: FederationContainer,
  moduleName: string
): Promise<RemoteModule<T>> => {
  // Call the get function which returns a factory
  const factory = await container.get(moduleName);
  
  if (typeof factory !== "function") {
    throw new Error(`Module "${moduleName}" factory is not a function`);
  }

  // Call the factory to get the actual module
  const module = factory();
  return module as RemoteModule<T>;
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
 */
export const loadRemoteByConfig = async <T = unknown>(
  config: RemoteConfig,
  options: LoadRemoteOptions = {}
): Promise<LoadRemoteResult<T>> => {
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
        const container = await initializeContainer(scope, url);
        const remoteModule = await getModuleFromContainer<T>(container, module);
        return remoteModule.default;
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
    containerCache.delete(scope);
  } else {
    moduleCache.clear();
    containerCache.clear();
  }
};
