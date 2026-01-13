import type { RemoteConfig, RemoteState, RemoteStatus } from "./types";

/**
 * Internal state for tracking remotes
 */
interface RegistryState {
  configs: Map<string, RemoteConfig>;
  states: Map<string, RemoteState>;
}

const state: RegistryState = {
  configs: new Map(),
  states: new Map(),
};

/**
 * Register a remote application in the registry
 */
export const registerRemote = (config: RemoteConfig): void => {
  state.configs.set(config.name, config);
  state.states.set(config.name, { status: "idle" });
};

/**
 * Register multiple remote applications at once
 */
export const registerRemotes = (configs: RemoteConfig[]): void => {
  configs.forEach(registerRemote);
};

/**
 * Get a remote configuration by name
 */
export const getRemoteConfig = (name: string): RemoteConfig | undefined => {
  return state.configs.get(name);
};

/**
 * Get all registered remote configurations
 */
export const getAllRemotes = (): RemoteConfig[] => {
  return Array.from(state.configs.values());
};

/**
 * Check if a remote is registered
 */
export const hasRemote = (name: string): boolean => {
  return state.configs.has(name);
};

/**
 * Remove a remote from the registry
 */
export const unregisterRemote = (name: string): boolean => {
  state.states.delete(name);
  return state.configs.delete(name);
};

/**
 * Clear all registered remotes
 */
export const clearRegistry = (): void => {
  state.configs.clear();
  state.states.clear();
};

/**
 * Update the status of a remote
 */
export const updateRemoteStatus = (
  name: string,
  status: RemoteStatus,
  error?: Error
): void => {
  const currentState = state.states.get(name);
  if (currentState) {
    state.states.set(name, {
      status,
      error,
      loadedAt: status === "loaded" ? Date.now() : currentState.loadedAt,
    });
  }
};

/**
 * Get the current state of a remote
 */
export const getRemoteState = (name: string): RemoteState | undefined => {
  return state.states.get(name);
};

/**
 * Get all remotes with a specific status
 */
export const getRemotesByStatus = (status: RemoteStatus): RemoteConfig[] => {
  return Array.from(state.configs.entries())
    .filter(([name]) => state.states.get(name)?.status === status)
    .map(([, config]) => config);
};
