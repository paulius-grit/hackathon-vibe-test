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
  BundlerType,
} from "./types";

export type {
  FederationConfig,
  MFLoadRemote,
  MFRegisterRemotes,
  MFRemoteInfo,
} from "./loadRemote";

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
