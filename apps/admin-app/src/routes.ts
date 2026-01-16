import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import App from "./App";
import CreateAppPage from "./pages/CreateAppPage";
import { EditAppPageWrapper } from "./components/EditAppPageWrapper";
import { MicroNotFoundPage } from "./components/MicroNotFoundPage";

/**
 * Route configuration for admin-app
 * Exported as MicroAppModule for the container to consume
 */
export const routeConfig = defineRoutes({
  routes: [
    {
      path: "/",
      component: App,
    },
    {
      path: "/create",
      component: CreateAppPage,
    },
    {
      path: "/edit/$appId",
      component: EditAppPageWrapper,
    },
  ],
  notFoundComponent: MicroNotFoundPage,
});

/**
 * Default export as MicroAppModule
 */
const microAppModule: MicroAppModule = {
  routeConfig,
};

export default microAppModule;
