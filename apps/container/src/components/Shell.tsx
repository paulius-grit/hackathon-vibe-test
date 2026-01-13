import { Link } from "@tanstack/react-router";
import { getConfiguredRemotes } from "@/config/remotes";
import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const remotes = getConfiguredRemotes();

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🔌</span>
          <span style={styles.logoText}>MF Hub</span>
        </div>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink} activeProps={{ style: styles.navLinkActive }}>
            🏠 Home
          </Link>

          <div style={styles.sectionTitle}>Micro Apps</div>

          {remotes.length === 0 ? (
            <p style={styles.emptyState}>No apps configured</p>
          ) : (
            remotes.map((remote) => (
              <Link
                key={remote.name}
                to="/remote/$name"
                params={{ name: remote.name }}
                style={styles.navLink}
                activeProps={{ style: styles.navLinkActive }}
              >
                {remote.icon ?? "📦"} {remote.title ?? remote.name}
              </Link>
            ))
          )}
        </nav>

        <div style={styles.footer}>
          <small>Module Federation Demo</small>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#1e293b",
    color: "white",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "1.5rem",
    borderBottom: "1px solid #334155",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  nav: {
    flex: 1,
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  sectionTitle: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
    letterSpacing: "0.05em",
  },
  navLink: {
    display: "block",
    padding: "0.75rem 1rem",
    color: "#cbd5e1",
    textDecoration: "none",
    borderRadius: "6px",
    transition: "background-color 0.15s",
  },
  navLinkActive: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  emptyState: {
    color: "#64748b",
    fontSize: "0.875rem",
    padding: "0.5rem 1rem",
  },
  footer: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #334155",
    color: "#64748b",
  },
  main: {
    flex: 1,
    backgroundColor: "#f8fafc",
    overflow: "auto",
  },
};
