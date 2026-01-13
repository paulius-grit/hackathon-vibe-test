import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to MF Hub</h1>
      <p style={styles.description}>
        This is the container application that hosts micro frontends using
        Module Federation.
      </p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Getting Started</h2>
        <p style={styles.cardText}>
          Select a micro app from the sidebar to load it dynamically. Each app
          is loaded on-demand using Module Federation.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Architecture</h2>
        <ul style={styles.list}>
          <li>📦 Module Federation for code sharing</li>
          <li>🚀 Dynamic remote loading at runtime</li>
          <li>🔄 TanStack Router for type-safe navigation</li>
          <li>⚡ Vite for fast development</li>
        </ul>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#1a1a1a",
  },
  description: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "2rem",
  },
  card: {
    background: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    marginBottom: "0.75rem",
    color: "#333",
  },
  cardText: {
    color: "#666",
    lineHeight: 1.6,
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
};
