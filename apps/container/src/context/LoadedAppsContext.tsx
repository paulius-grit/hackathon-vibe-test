import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface LoadedApp {
  name: string;
  title: string;
  icon: string;
  loadedAt: number;
}

interface LoadedAppsContextValue {
  loadedApps: LoadedApp[];
  activeApp: string | null;
  addLoadedApp: (app: Omit<LoadedApp, "loadedAt">) => void;
  removeLoadedApp: (name: string) => void;
  setActiveApp: (name: string | null) => void;
}

const LoadedAppsContext = createContext<LoadedAppsContextValue | undefined>(
  undefined
);

export function LoadedAppsProvider({ children }: { children: ReactNode }) {
  const [loadedApps, setLoadedApps] = useState<LoadedApp[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const addLoadedApp = useCallback((app: Omit<LoadedApp, "loadedAt">) => {
    setLoadedApps((prev) => {
      // Don't add duplicates
      if (prev.some((a) => a.name === app.name)) {
        return prev;
      }
      return [...prev, { ...app, loadedAt: Date.now() }];
    });
    setActiveApp(app.name);
  }, []);

  const removeLoadedApp = useCallback(
    (name: string) => {
      setLoadedApps((prev) => prev.filter((a) => a.name !== name));
      if (activeApp === name) {
        setActiveApp(null);
      }
    },
    [activeApp]
  );

  return (
    <LoadedAppsContext.Provider
      value={{
        loadedApps,
        activeApp,
        addLoadedApp,
        removeLoadedApp,
        setActiveApp,
      }}
    >
      {children}
    </LoadedAppsContext.Provider>
  );
}

export function useLoadedApps() {
  const context = useContext(LoadedAppsContext);
  if (!context) {
    throw new Error("useLoadedApps must be used within LoadedAppsProvider");
  }
  return context;
}
