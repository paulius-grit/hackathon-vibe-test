import { useState, useEffect, type ReactNode, type ComponentType } from "react";
import { loadRemoteByUrl, type LoadRemoteResult } from "@mf-hub/loader";
import { Card, CardContent, Skeleton } from "@mf-hub/ui";
import { ErrorBoundary } from "./ErrorBoundary";

interface RemoteLoaderProps {
  url: string;
  scope: string;
  module?: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

type RemoteState =
  | { status: "loading" }
  | { status: "loaded"; Component: ComponentType }
  | { status: "error"; error: Error };

export function RemoteLoader({
  url,
  scope,
  module = "./App",
  fallback = <DefaultFallback />,
  errorFallback,
}: RemoteLoaderProps) {
  const [state, setState] = useState<RemoteState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState({ status: "loading" });

      const result: LoadRemoteResult<ComponentType> = await loadRemoteByUrl(
        url,
        scope,
        module
      );

      if (cancelled) return;

      if (result.success) {
        setState({ status: "loaded", Component: result.module });
      } else {
        setState({ status: "error", error: result.error });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, scope, module]);

  if (state.status === "loading") {
    return <>{fallback}</>;
  }

  if (state.status === "error") {
    return (
      <>
        {errorFallback ?? (
          <DefaultErrorFallback error={state.error} url={url} scope={scope} />
        )}
      </>
    );
  }

  const { Component } = state;

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
      <Component />
    </ErrorBoundary>
  );
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
