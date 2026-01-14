/**
 * Type declarations for vite-plugin-federation's virtual module
 * This module is only available at runtime in apps using the federation plugin
 */
declare module "virtual:__federation__" {
  export interface IRemoteConfig {
    url: (() => Promise<string>) | string;
    format: "esm" | "systemjs" | "var";
    from: "vite" | "webpack";
  }

  /**
   * Register a remote with the federation runtime
   * This must be called before getRemote can load from that remote
   */
  export const __federation_method_setRemote: (
    name: string,
    config: IRemoteConfig
  ) => void;

  /**
   * Load a module from a registered remote
   * @param scope - The remote scope name (same as used in setRemote)
   * @param module - The module path (e.g., "./App" or "./routes")
   */
  export const __federation_method_getRemote: (
    scope: string,
    module: string
  ) => Promise<unknown>;

  /**
   * Unwrap the default export from a remote module
   * Handles the async boundary for shared modules
   */
  export const __federation_method_unwrapDefault: (module: unknown) => unknown;

  /**
   * Ensure a remote is initialized (loads remoteEntry.js and initializes share scope)
   * Must be called after setRemote and before getRemote
   */
  export const __federation_method_ensure: (
    remoteName: string
  ) => Promise<unknown>;
}
