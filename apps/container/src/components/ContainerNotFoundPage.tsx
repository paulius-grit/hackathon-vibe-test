import { NotFoundPage } from "@mf-hub/ui";
import { Link, useLocation } from "@tanstack/react-router";

/**
 * 404 page for the container.
 * This handles routes that don't match any known patterns.
 */
export function ContainerNotFoundPage() {
  const { pathname } = useLocation();

  return (
    <NotFoundPage
      title="Page Not Found"
      description="The page you're looking for doesn't exist in this application."
      path={pathname}
      LinkComponent={({ to, children, className }) => (
        <Link to={to} className={className}>
          {children}
        </Link>
      )}
      onBackClick={() => window.history.back()}
    />
  );
}
