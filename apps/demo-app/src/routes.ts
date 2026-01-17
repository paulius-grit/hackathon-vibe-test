import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import "./index.css";
import App from "./App";
import InfoPage from "./pages/InfoPage";
import { MicroNotFoundPage } from "./components/MicroNotFoundPage";

/**
 * Route configuration for demo-app
 * Exported as MicroAppModule for the container to consume
 */
export const routeConfig = defineRoutes({
  routes: [
    {
      path: "/",
      component: App,
    },
    {
      path: "/info",
      component: InfoPage,
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
