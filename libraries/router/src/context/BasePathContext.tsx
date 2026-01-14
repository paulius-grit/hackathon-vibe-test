import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { BasePathContextValue } from "../types";

const BasePathContext = createContext<BasePathContextValue | null>(null);

interface BasePathProviderProps {
  /** The base path where the micro-app is mounted */
  basePath: string;
  children: ReactNode;
}

/**
 * Normalizes a path by ensuring it starts with / and doesn't end with /
 */
function normalizePath(path: string): string {
  let normalized = path;
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

/**
 * Provider that supplies the base path context to micro-apps.
 * This should be rendered by the container around each micro-app.
 */
export function BasePathProvider({
  basePath,
  children,
}: BasePathProviderProps) {
  const normalizedBasePath = normalizePath(basePath);

  const value = useMemo<BasePathContextValue>(
    () => ({
      basePath: normalizedBasePath,
      resolvePath: (relativePath: string) => {
        const normalizedRelative = normalizePath(relativePath);
        if (normalizedBasePath === "/") {
          return normalizedRelative;
        }
        if (normalizedRelative === "/") {
          return normalizedBasePath;
        }
        return normalizedBasePath + normalizedRelative;
      },
    }),
    [normalizedBasePath]
  );

  return (
    <BasePathContext.Provider value={value}>
      {children}
    </BasePathContext.Provider>
  );
}

/**
 * Hook to access the base path context.
 * Must be used within a BasePathProvider.
 */
export function useBasePath(): BasePathContextValue {
  const context = useContext(BasePathContext);
  if (!context) {
    // Return default context for standalone development
    return {
      basePath: "/",
      resolvePath: (path) => normalizePath(path),
    };
  }
  return context;
}

/**
 * Hook to check if we're running inside a container
 */
export function useIsEmbedded(): boolean {
  const context = useContext(BasePathContext);
  return context !== null && context.basePath !== "/";
}
