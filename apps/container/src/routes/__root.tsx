import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Shell } from "@/components/Shell";
import { ContainerNotFoundPage } from "@/components/ContainerNotFoundPage";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: ContainerNotFoundPage,
});

function RootLayout() {
  return (
    <Shell>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </Shell>
  );
}
