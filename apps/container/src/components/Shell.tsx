import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useRemotes } from "@/context/RemotesContext";
import { useLoadedApps } from "@/context/LoadedAppsContext";
import {
  cn,
  Button,
  Tooltip,
  Home,
  Target,
  Calendar,
  Package,
  Plug,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Skeleton,
  type LucideIcon,
} from "@mf-hub/ui";
import { useState, type ReactNode } from "react";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Home,
  Target,
  Calendar,
  Package,
  Plug,
};

function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Package;
}

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { remotes, isLoading: isLoadingRemotes } = useRemotes();

  const { loadedApps, activeApp, removeLoadedApp, setActiveApp } =
    useLoadedApps();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleTabClick = (appName: string) => {
    setActiveApp(appName);
    navigate({ to: "/apps/$name", params: { name: appName } });
  };

  const handleTabClose = (appName: string) => {
    const appIndex = loadedApps.findIndex((a) => a.name === appName);
    removeLoadedApp(appName);

    // Navigate to another tab or home
    if (activeApp === appName) {
      if (loadedApps.length > 1) {
        const nextApp = loadedApps[appIndex === 0 ? 1 : appIndex - 1];
        if (nextApp) {
          navigate({ to: "/apps/$name", params: { name: nextApp.name } });
        }
      } else {
        navigate({ to: "/" });
      }
    }
  };

  const handleHomeClick = () => {
    setActiveApp(null);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]",
          "transition-all duration-300 ease-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center border-b border-[hsl(var(--sidebar-border))]",
            "transition-all duration-300",
            isCollapsed ? "justify-center px-2 py-5" : "gap-3 px-6 py-5"
          )}
        >
          <Plug className="w-6 h-6 flex-shrink-0" />
          <span
            className={cn(
              "text-lg font-semibold tracking-tight whitespace-nowrap overflow-hidden",
              "transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            MF Hub
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-2">
          <NavLink
            to="/"
            iconName="Home"
            isCollapsed={isCollapsed}
            isActive={currentPath === "/"}
          >
            Home
          </NavLink>

          <div
            className={cn(
              "mt-6 mb-2 overflow-hidden transition-all duration-300",
              isCollapsed ? "px-0 opacity-0 h-0" : "px-3 opacity-100 h-auto"
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/50">
              Micro Apps
            </span>
          </div>

          {isLoadingRemotes ? (
            <div className="space-y-2 px-2">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : remotes.length === 0 ? (
            <p
              className={cn(
                "text-sm text-[hsl(var(--sidebar-foreground))]/40 transition-all duration-300",
                isCollapsed ? "px-2 opacity-0" : "px-3 py-2 opacity-100"
              )}
            >
              No apps configured
            </p>
          ) : (
            remotes.map((remote) => (
              <NavLink
                key={remote.name}
                to="/apps/$name"
                params={{ name: remote.name }}
                iconName={remote.icon ?? "Package"}
                isCollapsed={isCollapsed}
                isActive={currentPath.startsWith(`/apps/${remote.name}`)}
              >
                {remote.title ?? remote.name}
              </NavLink>
            ))
          )}
        </nav>

        {/* Collapse Button */}
        <div className="p-2 border-t border-[hsl(var(--sidebar-border))]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full justify-center text-[hsl(var(--sidebar-foreground))]/70",
              "hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))]"
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Tabs Header */}
        {loadedApps.length > 0 && (
          <header className="flex-shrink-0 border-b border-border bg-muted/30 px-4 py-2 opacity-0 animate-fade-in">
            <div className="flex items-center gap-1">
              {/* Home Tab */}
              <button
                onClick={handleHomeClick}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
                  "transition-all duration-200",
                  currentPath === "/" && !activeApp
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <div className="w-px h-4 bg-border mx-1" />

              {/* App Tabs */}
              {loadedApps.map((app) => {
                const IconComponent = getIconComponent(app.icon);
                return (
                  <div
                    key={app.name}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
                      "transition-all duration-200 group",
                      activeApp === app.name
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <button
                      onClick={() => handleTabClick(app.name)}
                      className="inline-flex items-center gap-2"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{app.title}</span>
                    </button>
                    <button
                      onClick={() => handleTabClose(app.name)}
                      className={cn(
                        "ml-1 rounded-sm p-0.5 -mr-1",
                        "opacity-0 group-hover:opacity-60 hover:!opacity-100",
                        "hover:bg-muted-foreground/20",
                        "transition-opacity"
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  params?: Record<string, string>;
  iconName: string;
  children: ReactNode;
  isCollapsed: boolean;
  isActive: boolean;
}

function NavLink({
  to,
  params,
  iconName,
  children,
  isCollapsed,
  isActive,
}: NavLinkProps) {
  const IconComponent = getIconComponent(iconName);

  const linkContent = (
    <Link
      to={to}
      params={params}
      className={cn(
        "flex items-center rounded-lg font-medium",
        "transition-all duration-200",
        isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
        isActive
          ? "bg-[hsl(var(--sidebar-accent))] text-white"
          : "text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))]"
      )}
    >
      <IconComponent
        className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")}
      />
      <span
        className={cn(
          "text-sm whitespace-nowrap overflow-hidden",
          "transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {children}
      </span>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={children} side="right">
        {linkContent}
      </Tooltip>
    );
  }

  return linkContent;
}
