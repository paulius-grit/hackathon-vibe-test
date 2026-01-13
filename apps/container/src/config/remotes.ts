import type { RemoteAppDescriptor } from "@mf-hub/loader";

/**
 * Extended remote configuration with UI metadata
 */
export interface RemoteAppConfig extends RemoteAppDescriptor {
  /** Unique identifier for routing */
  name: string;
  /** Display title in the sidebar */
  title: string;
  /** Emoji or icon identifier */
  icon?: string;
}

/**
 * Static configuration of available remote apps.
 * In production, this could be fetched from an API.
 */
const remoteApps: RemoteAppConfig[] = [
  {
    name: "demo-app",
    title: "Demo Application",
    icon: "🎯",
    url: "http://localhost:3001",
    scope: "demo-app",
    module: "./App",
  },
];

/**
 * Get all configured remote applications
 */
export const getConfiguredRemotes = (): RemoteAppConfig[] => {
  return remoteApps;
};

/**
 * Find a remote by its name
 */
export const getRemoteByName = (name: string): RemoteAppConfig | undefined => {
  return remoteApps.find((remote) => remote.name === name);
};

/**
 * Add a remote dynamically (e.g., from API response)
 */
export const addRemote = (config: RemoteAppConfig): void => {
  const existing = remoteApps.findIndex((r) => r.name === config.name);
  if (existing >= 0) {
    remoteApps[existing] = config;
  } else {
    remoteApps.push(config);
  }
};

/**
 * Add multiple remotes from an API response
 */
export const addRemotesFromApi = (configs: RemoteAppConfig[]): void => {
  configs.forEach(addRemote);
};

/**
 * Clear all configured remotes
 */
export const clearRemotes = (): void => {
  remoteApps.length = 0;
};
