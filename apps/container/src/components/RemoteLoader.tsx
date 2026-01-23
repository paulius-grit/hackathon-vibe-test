import { useState, useEffect, type ReactNode } from "react";
import {
  loadRemoteByUrl,
  type LoadRemoteResult,
  type BundlerType,
} from "@mf-hub/loader";
import {
  MicroAppRenderer,
  type MicroAppModule,
  type MicroAppRouteConfig,
} from "@mf-hub/router";
import { Card, CardContent, Skeleton } from "@mf-hub/ui";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Load CSS from the remote app's dist folder
 * This ensures micro-app styles are loaded when the remote is mounted
 */
async function loadRemoteCSS(url: string, scope: string): Promise<void> {
  // Check if CSS is already loaded for this scope
  const linkId = `remote-css-${scope}`;
  if (document.getElementById(linkId)) {
    return;
  }

  // Try to fetch the style.css file from the remote
  // @module-federation/vite outputs CSS to /assets/style-*.css
  const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

  try {
    // First, try to find the CSS file by fetching the index.html and parsing it
    const indexResponse = await fetch(`${cleanUrl}/index.html`);
    if (indexResponse.ok) {
      const html = await indexResponse.text();
      // Extract CSS link from the HTML
      const cssMatch = html.match(/href=["']([^"']*style[^"']*\.css)["']/);
      if (cssMatch && cssMatch[1]) {
        const cssPath = cssMatch[1];
        const cssUrl = cssPath.startsWith("http")
          ? cssPath
          : `${cleanUrl}${cssPath.startsWith("/") ? "" : "/"}${cssPath}`;

        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = cssUrl;
        document.head.appendChild(link);
        return;
      }
    }
  } catch {
    // Ignore errors - CSS might not be available or might be loaded differently
  }
}

interface RemoteLoaderProps {
  /** Name of the app (used for routing base path) */
  name: string;
  /** URL where the remote is hosted */
  url: string;
  /** Federation scope name */
  scope: string;
  /** Module to load (defaults to ./routes) */
  module?: string;
  /** Bundler type: 'vite' or 'webpack' (defaults to 'vite') */
  bundler?: BundlerType;
  /** Loading fallback */
  fallback?: ReactNode;
  /** Error fallback */
  errorFallback?: ReactNode;
  /** Initial path within the micro-app (extracted from URL splat) */
  initialPath?: string;
  /** Whether to use browser history (default: true for URL sync) */
  useBrowserHistory?: boolean;
}

type RemoteState =
  | { status: "loading" }
  | { status: "loaded"; routeConfig: MicroAppRouteConfig }
  | { status: "error"; error: Error };

export function RemoteLoader({
  name,
  url,
  scope,
  module = "./routes",
  bundler = "vite",
  fallback = <DefaultFallback />,
  errorFallback,
  initialPath = "/",
  useBrowserHistory = true,
}: RemoteLoaderProps) {
  const [state, setState] = useState<RemoteState>({ status: "loading" });

  // Base path where this micro-app is mounted
  const basePath = `/apps/${name}`;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState({ status: "loading" });

      // Load CSS from the remote app in parallel with the module
      loadRemoteCSS(url, scope);

      const result: LoadRemoteResult<MicroAppModule> = await loadRemoteByUrl(
        url,
        scope,
        module,
        {},
        bundler,
      );

      if (cancelled) return;

      if (result.success) {
        const microAppModule = result.module;

        // Validate that it has the expected shape
        if (!microAppModule?.routeConfig?.routes) {
          setState({
            status: "error",
            error: new Error(
              `Remote "${scope}" does not export a valid routeConfig. ` +
                `Expected { routeConfig: { routes: [...] } }`,
            ),
          });
          return;
        }

        // Run init if provided
        if (microAppModule.init) {
          await microAppModule.init({ basePath });
        }

        setState({ status: "loaded", routeConfig: microAppModule.routeConfig });
      } else {
        setState({ status: "error", error: result.error });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, scope, module, bundler, basePath]);

  // Render content based on loading state
  const renderContent = () => {
    if (state.status === "loading") {
      return fallback;
    }

    if (state.status === "error") {
      return (
        errorFallback ?? (
          <DefaultErrorFallback error={state.error} url={url} scope={scope} />
        )
      );
    }

    return (
      <ErrorBoundary
        fallback={
          <DefaultErrorFallback
            error={new Error("Remote component crashed")}
            url={url}
            scope={scope}
          />
        }
      >
        <MicroAppRenderer
          basePath={basePath}
          routeConfig={state.routeConfig}
          initialPath={initialPath}
          useBrowserHistory={useBrowserHistory}
          fallback={fallback}
        />
      </ErrorBoundary>
    );
  };

  return <div className="h-full">{renderContent()}</div>;
}

function DefaultFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-16">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-4">
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground animate-pulse">
        Loading micro app...
      </p>
    </div>
  );
}

interface ErrorFallbackProps {
  error: Error;
  url: string;
  scope: string;
}

function DefaultErrorFallback({ error, url, scope }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center p-16">
      <Card className="max-w-lg w-full border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Failed to load micro app
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <div className="w-full bg-muted rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-foreground">Scope:</span>{" "}
                  <code className="text-muted-foreground">{scope}</code>
                </p>
                <p>
                  <span className="font-medium text-foreground">URL:</span>{" "}
                  <code className="text-muted-foreground text-xs break-all">
                    {url}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
