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
  Shield,
  Rocket,
  Sparkles,
  Zap,
  Box,
  Compass,
  Settings,
  Star,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Skeleton,
  Container,
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
  Shield,
  Rocket,
  Sparkles,
  Zap,
  Box,
  Compass,
  Settings,
  Star,
};

function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Package;
}

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { remotes, isLoading: isLoadingRemotes } = useRemotes();

  const { loadedApps, activeApp, removeLoadedApp, setActiveApp } =
    useLoadedApps();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleTabClick = (appName: string) => {
    setActiveApp(appName);
    navigate({ to: "/apps/$name/$", params: { name: appName, _splat: "" } });
  };

  const handleTabClose = (appName: string) => {
    const appIndex = loadedApps.findIndex((a) => a.name === appName);
    removeLoadedApp(appName);

    // Navigate to another tab or home
    if (activeApp === appName) {
      if (loadedApps.length > 1) {
        const nextApp = loadedApps[appIndex === 0 ? 1 : appIndex - 1];
        if (nextApp) {
          navigate({
            to: "/apps/$name/$",
            params: { name: nextApp.name, _splat: "" },
          });
        }
      } else {
        navigate({ to: "/" });
      }
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]",
          "transition-all duration-300 ease-out",
          isCollapsed ? "w-14" : "w-56",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center border-b border-[hsl(var(--sidebar-border))]",
            "transition-all duration-300",
            "py-3 px-4",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <Container className="w-5 h-5 shrink-0" />
          <span
            className={cn(
              "text-base font-semibold tracking-tight whitespace-nowrap overflow-hidden",
              "transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            Gritbench
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
              "my-2 transition-all duration-300",
              isCollapsed ? "px-0 h-0" : "px-2 h-auto",
            )}
          >
            {!isCollapsed && (
              <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/50">
                Micro Apps
              </span>
            )}
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
                isCollapsed ? "px-2 opacity-0" : "px-3 py-2 opacity-100",
              )}
            >
              No apps configured
            </p>
          ) : (
            remotes.map((remote) => (
              <NavLink
                key={remote.name}
                to="/apps/$name/$"
                params={{ name: remote.name, _splat: "" }}
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
              "hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))]",
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
          <header className="flex-shrink-0 border-b border-border bg-muted/40 px-4 py-2 opacity-0 animate-fade-in">
            <div className="flex items-center gap-1 overflow-y-auto">
              {loadedApps.map((app) => {
                const IconComponent = getIconComponent(app.icon);
                return (
                  <div
                    key={app.name}
                    className={cn(
                      "flex shrink-0 items-center gap-0 px-3 py-1.5 text-sm font-medium rounded-md border border-transparent",
                      "transition-all duration-200 group",
                      currentPath.startsWith(`/apps/${app.name}`)
                        ? "bg-background text-foreground shadow-s border-gray-200"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                    )}
                  >
                    <button
                      onClick={() => handleTabClick(app.name)}
                      className="inline-flex items-center gap-2"
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{app.title}</span>
                    </button>
                    <button
                      onClick={() => handleTabClose(app.name)}
                      className={cn(
                        "ml-1 rounded-sm p-0.5 -mr-1",
                        "opacity-0 group-hover:opacity-60 hover:!opacity-100",
                        "transition-opacity",
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
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
        isCollapsed ? "justify-center p-2" : "gap-3 p-2",
        isActive
          ? "bg-[hsl(var(--sidebar-accent))] text-white"
          : "text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))]",
      )}
    >
      <IconComponent
        className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")}
      />
      <span
        className={cn(
          "text-sm whitespace-nowrap overflow-hidden",
          "transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
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
