import { createFileRoute } from "@tanstack/react-router";
import { RemoteLoader } from "@/components/RemoteLoader";
import { getRemoteByName } from "@/config/remotes";

export const Route = createFileRoute("/remote/$name")({
  component: RemotePage,
  loader: ({ params }) => {
    const remote = getRemoteByName(params.name);
    return { remote, name: params.name };
  },
});

function RemotePage() {
  const { remote, name } = Route.useLoaderData();

  if (!remote) {
    return (
      <div style={styles.error}>
        <h2>Remote Not Found</h2>
        <p>The micro app "{name}" is not configured.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <RemoteLoader
        url={remote.url}
        scope={remote.scope}
        module={remote.module}
        fallback={<LoadingSpinner name={name} />}
      />
    </div>
  );
}

function LoadingSpinner({ name }: { name: string }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <p>Loading {name}...</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "1rem",
    minHeight: "100%",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
    color: "#666",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e0e0e0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  error: {
    padding: "2rem",
    textAlign: "center",
    color: "#dc2626",
  },
};
