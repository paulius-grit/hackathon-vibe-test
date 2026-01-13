/**
 * Configuration for a remote micro frontend application
 */
export interface RemoteConfig {
  /** Unique identifier for the remote */
  name: string;
  /** URL where the remote entry file is hosted */
  url: string;
  /** The scope/name used in Module Federation config */
  scope: string;
  /** Optional: specific module to load (defaults to "./App") */
  module?: string;
}

/**
 * Registry of all available remote applications
 */
export interface RemoteRegistry {
  remotes: Map<string, RemoteConfig>;
}

/**
 * Result of loading a remote module
 */
export type LoadRemoteResult<T> =
  | { success: true; module: T }
  | { success: false; error: Error };

/**
 * A loaded remote module with its default export
 */
export interface RemoteModule<T = unknown> {
  default: T;
  [key: string]: unknown;
}

/**
 * Options for loading a remote
 */
export interface LoadRemoteOptions {
  /** Timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Retry attempts on failure (default: 0) */
  retries?: number;
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
}

/**
 * Descriptor for a remote app returned from an API
 * This is a simplified version that doesn't require a registry name
 */
export interface RemoteAppDescriptor {
  /** URL where the remote entry file is hosted */
  url: string;
  /** The scope/name used in Module Federation config */
  scope: string;
  /** Optional: specific module to load (defaults to "./App") */
  module?: string;
  /** Optional: any additional metadata about the app */
  metadata?: Record<string, unknown>;
}

/**
 * Status of a remote module
 */
export type RemoteStatus = "idle" | "loading" | "loaded" | "error";

/**
 * State tracking for a remote module
 */
export interface RemoteState {
  status: RemoteStatus;
  error?: Error;
  loadedAt?: number;
}
