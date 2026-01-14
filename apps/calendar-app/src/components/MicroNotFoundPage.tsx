import { NotFoundPage, type NotFoundPageProps } from "@mf-hub/ui";
import { MicroLink, useBasePath } from "@mf-hub/router";

/**
 * A 404 page component configured for use within micro-apps.
 * Uses MicroLink for navigation, ensuring basepath-aware routing.
 */
export function MicroNotFoundPage(
  props: Omit<NotFoundPageProps, "LinkComponent" | "onBackClick">
) {
  const { basePath } = useBasePath();

  return (
    <NotFoundPage
      {...props}
      path={basePath !== "/" ? `${basePath}${props.path ?? ""}` : props.path}
      LinkComponent={MicroLink}
      onBackClick={() => window.history.back()}
    />
  );
}
