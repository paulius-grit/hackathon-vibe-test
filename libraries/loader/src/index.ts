// Types
export type {
  RemoteConfig,
  RemoteRegistry,
  LoadRemoteResult,
  RemoteModule,
  LoadRemoteOptions,
  RemoteStatus,
  RemoteState,
  RemoteAppDescriptor,
} from "./types";

export type { FederationMethods, FederationRemoteConfig } from "./loadRemote";

// Registry functions
export {
  registerRemote,
  registerRemotes,
  getRemoteConfig,
  getAllRemotes,
  hasRemote,
  unregisterRemote,
  clearRegistry,
  updateRemoteStatus,
  getRemoteState,
  getRemotesByStatus,
} from "./registry";

// Loader functions
export {
  initFederation,
  isFederationInitialized,
  loadRemote,
  loadRemoteByConfig,
  loadRemoteByUrl,
  loadRemoteByDescriptor,
  preloadRemote,
  clearModuleCache,
} from "./loadRemote";
