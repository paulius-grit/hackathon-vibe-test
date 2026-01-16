import { useParams } from "@tanstack/react-router";
import EditAppPage from "../pages/EditAppPage";

/**
 * Wrapper to extract the appId from route params and pass to EditAppPage
 */
export function EditAppPageWrapper() {
  // Get the appId from route params
  // TanStack Router exposes params via useParams hook
  const params = useParams({ strict: false });
  const appId = (params as { appId?: string }).appId ?? "";

  return <EditAppPage appId={appId} />;
}
