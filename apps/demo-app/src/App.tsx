import { useState } from "react";

/**
 * Demo App - Exposed via Module Federation
 * This component is loaded dynamically by the container app.
 */
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.badge}>🎯 Remote App</span>
        <h1 style={styles.title}>Demo Application</h1>
        <p style={styles.subtitle}>
          This micro app is loaded via Module Federation
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Interactive Counter</h2>
        <p style={styles.cardText}>
          This demonstrates that state works correctly in federated modules.
        </p>

        <div style={styles.counterContainer}>
          <button
            style={styles.button}
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </button>
          <span style={styles.count}>{count}</span>
          <button
            style={styles.button}
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Module Info</h2>
        <ul style={styles.infoList}>
          <li>
            <strong>Scope:</strong> demoApp
          </li>
          <li>
            <strong>Module:</strong> ./App
          </li>
          <li>
            <strong>Port:</strong> 3001
          </li>
          <li>
            <strong>Shared:</strong> react, react-dom
          </li>
        </ul>
      </div>

      <div style={styles.footer}>
        <p>
          ✅ Successfully loaded from{" "}
          <code style={styles.code}>http://localhost:3001</code>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: "1.125rem",
    color: "#334155",
    marginBottom: "0.5rem",
  },
  cardText: {
    color: "#64748b",
    marginBottom: "1rem",
  },
  counterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    transition: "background-color 0.15s",
  },
  count: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#1e293b",
    minWidth: "80px",
    textAlign: "center",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    color: "#64748b",
    fontSize: "0.875rem",
  },
  code: {
    backgroundColor: "#f1f5f9",
    padding: "0.125rem 0.375rem",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
};
