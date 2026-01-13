import { useState, useEffect, type ReactNode, type ComponentType } from "react";
import { loadRemoteByUrl, type LoadRemoteResult } from "@mf-hub/loader";
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
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.text}>Loading micro app...</p>
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
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <h3 style={styles.errorTitle}>Failed to load micro app</h3>
      <p style={styles.errorText}>{error.message}</p>
      <div style={styles.errorDetails}>
        <p>
          <strong>Scope:</strong> {scope}
        </p>
        <p>
          <strong>URL:</strong> {url}
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
    color: "#64748b",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  errorTitle: {
    color: "#dc2626",
    marginBottom: "0.5rem",
  },
  errorText: {
    color: "#64748b",
    marginBottom: "1rem",
  },
  errorDetails: {
    backgroundColor: "#f1f5f9",
    padding: "1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    color: "#475569",
  },
};
