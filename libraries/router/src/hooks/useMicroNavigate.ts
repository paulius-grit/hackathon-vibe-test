import { useCallback } from "react";
import { useNavigate as useTanStackNavigate } from "@tanstack/react-router";
import { useBasePath } from "../context/BasePathContext";

/**
 * Navigation options
 */
export interface NavigateOptions {
  /** Replace current history entry instead of pushing */
  replace?: boolean;
  /** If true, treat the path as absolute (bypass base path) */
  absolute?: boolean;
}

/**
 * Hook for programmatic navigation within a micro-app.
 * Automatically handles base path resolution.
 */
export function useMicroNavigate() {
  const navigate = useTanStackNavigate();
  const { resolvePath } = useBasePath();

  return useCallback(
    (to: string, options: NavigateOptions = {}) => {
      const { replace = false, absolute = false } = options;
      const resolvedPath = absolute ? to : resolvePath(to);

      navigate({
        to: resolvedPath,
        replace,
      });
    },
    [navigate, resolvePath]
  );
}

/**
 * Hook to get current location relative to the micro-app's base path
 */
export function useMicroLocation() {
  const { basePath } = useBasePath();

  // This would need to be enhanced with actual location tracking
  // For now, return a simple interface
  return {
    basePath,
    // Additional location info would come from router context
  };
}
