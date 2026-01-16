import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { RemoteAppDescriptor } from "@mf-hub/loader";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Extended remote configuration with UI metadata
 */
export interface RemoteAppConfig extends RemoteAppDescriptor {
  /** Unique identifier */
  id?: string;
  /** Unique identifier for routing */
  name: string;
  /** Display title in the sidebar */
  title: string;
  /** Lucide icon name */
  icon?: string;
  /** Whether the app is active */
  isActive?: boolean;
  /** Display order in sidebar */
  displayOrder?: number;
  /** Whether this is a system/hardcoded app (not from API) */
  isSystem?: boolean;
}

/**
 * Hardcoded system apps that are always available
 * These apps are not fetched from the API and cannot be modified
 */
const SYSTEM_APPS: RemoteAppConfig[] = [
  {
    name: "admin",
    title: "Admin",
    icon: "Shield",
    url: "http://localhost:3003",
    scope: "admin-app",
    module: "./routes",
    isActive: true,
    displayOrder: 999, // Always at the bottom
    isSystem: true,
  },
];

/**
 * API response shape
 */
interface ApiRemoteApp {
  id: string;
  name: string;
  title: string;
  icon: string;
  url: string;
  scope: string;
  module: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface RemotesContextValue {
  remotes: RemoteAppConfig[];
  isLoading: boolean;
  error: string | null;
  getRemoteByName: (name: string) => RemoteAppConfig | undefined;
  refreshRemotes: () => Promise<void>;
}

const RemotesContext = createContext<RemotesContextValue | null>(null);

/**
 * Transform API response to RemoteAppConfig
 */
function transformApiResponse(apiApp: ApiRemoteApp): RemoteAppConfig {
  return {
    id: apiApp.id,
    name: apiApp.name,
    title: apiApp.title,
    icon: apiApp.icon,
    url: apiApp.url,
    scope: apiApp.scope,
    module: apiApp.module,
    isActive: apiApp.isActive,
    displayOrder: apiApp.displayOrder,
  };
}

/**
 * Fetch remote apps from the API
 */
async function fetchRemoteApps(): Promise<RemoteAppConfig[]> {
  const response = await fetch(`${API_BASE_URL}/remote-apps?active=true`);

  if (!response.ok) {
    throw new Error(`Failed to fetch remote apps: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Invalid API response");
  }

  return json.data.map(transformApiResponse);
}

interface RemotesProviderProps {
  children: ReactNode;
  /** Fallback remotes to use if API fails */
  fallbackRemotes?: RemoteAppConfig[];
}

export function RemotesProvider({
  children,
  fallbackRemotes = [],
}: RemotesProviderProps) {
  const [apiRemotes, setApiRemotes] = useState<RemoteAppConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Combine API remotes with system apps
  // System apps are always included regardless of API state
  const remotes = [...apiRemotes, ...SYSTEM_APPS].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

  const refreshRemotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apps = await fetchRemoteApps();
      setApiRemotes(apps);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load remote apps";
      setError(message);
      console.error("Failed to fetch remote apps:", err);

      // Keep fallback remotes if API fails
      if (apiRemotes.length === 0 && fallbackRemotes.length > 0) {
        setApiRemotes(fallbackRemotes);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fallbackRemotes, apiRemotes.length]);

  const getRemoteByName = useCallback(
    (name: string): RemoteAppConfig | undefined => {
      return remotes.find((remote) => remote.name === name);
    },
    [remotes],
  );

  useEffect(() => {
    refreshRemotes();
  }, []);

  return (
    <RemotesContext.Provider
      value={{
        remotes,
        isLoading,
        error,
        getRemoteByName,
        refreshRemotes,
      }}
    >
      {children}
    </RemotesContext.Provider>
  );
}

export function useRemotes(): RemotesContextValue {
  const context = useContext(RemotesContext);
  if (!context) {
    throw new Error("useRemotes must be used within a RemotesProvider");
  }
  return context;
}

/**
 * Hook to get a specific remote by name
 */
export function useRemote(name: string): {
  remote: RemoteAppConfig | undefined;
  isLoading: boolean;
  error: string | null;
} {
  const { getRemoteByName, isLoading, error } = useRemotes();
  return {
    remote: getRemoteByName(name),
    isLoading,
    error,
  };
}
