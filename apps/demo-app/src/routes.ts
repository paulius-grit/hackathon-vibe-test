import { defineRoutes, type MicroAppModule } from "@mf-hub/router";
import App from "./App";

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
  ],
});

/**
 * Default export as MicroAppModule
 */
const microAppModule: MicroAppModule = {
  routeConfig,
};

export default microAppModule;
