import { Link } from "@tanstack/react-router";
import { getConfiguredRemotes } from "@/config/remotes";
import { cn } from "@mf-hub/ui";
import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const remotes = getConfiguredRemotes();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[hsl(var(--sidebar-border))]">
          <span className="text-2xl">🔌</span>
          <span className="text-lg font-semibold tracking-tight">MF Hub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3">
          <NavLink to="/" icon="🏠">
            Home
          </NavLink>

          <div className="mt-6 mb-2 px-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/50">
              Micro Apps
            </span>
          </div>

          {remotes.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[hsl(var(--sidebar-foreground))]/40">
              No apps configured
            </p>
          ) : (
            remotes.map((remote) => (
              <NavLink
                key={remote.name}
                to="/remote/$name"
                params={{ name: remote.name }}
                icon={remote.icon ?? "📦"}
              >
                {remote.title ?? remote.name}
              </NavLink>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[hsl(var(--sidebar-border))]">
          <p className="text-xs text-[hsl(var(--sidebar-foreground))]/40">
            Module Federation Demo
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background overflow-auto">{children}</main>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  params?: Record<string, string>;
  icon: string;
  children: ReactNode;
}

function NavLink({ to, params, icon, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      params={params}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
        "text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))]",
        "hover:bg-[hsl(var(--sidebar-muted))] transition-colors"
      )}
      activeProps={{
        className: cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
          "bg-[hsl(var(--sidebar-accent))] text-white",
          "hover:bg-[hsl(var(--sidebar-accent))]/90"
        ),
      }}
    >
      <span className="text-base">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
