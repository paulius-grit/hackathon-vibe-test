/**
 * Remote App Configuration
 *
 * This module re-exports types from RemotesContext.
 * The actual remote loading is now handled via React Context.
 *
 * @see ../context/RemotesContext.tsx
 */

// Re-export types for convenience
export type { RemoteAppConfig } from "../context/RemotesContext";
export {
  useRemotes,
  useRemote,
  RemotesProvider,
} from "../context/RemotesContext";
