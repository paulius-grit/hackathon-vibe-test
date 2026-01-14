import type { ComponentType, ReactNode } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { ArrowLeft, Home } from "lucide-react";

export interface NotFoundPageProps {
  /** Title to display (default: "Page Not Found") */
  title?: string;
  /** Description text */
  description?: string;
  /** The path that was not found (optional) */
  path?: string;
  /** Custom icon component */
  icon?: ReactNode;
  /** Show home button */
  showHomeButton?: boolean;
  /** Show back button */
  showBackButton?: boolean;
  /** Custom home path (default: "/") */
  homePath?: string;
  /** Custom navigation handler for home button */
  onHomeClick?: () => void;
  /** Custom navigation handler for back button */
  onBackClick?: () => void;
  /** Link component to use for navigation (allows injection of MicroLink or other Link components) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkComponent?: ComponentType<any>;
  /** Additional actions to display */
  actions?: ReactNode;
}

/**
 * A reusable 404 Not Found page component.
 * Can be used by the container and all micro-apps for consistent look and feel.
 *
 * @example
 * // Basic usage in a micro-app
 * <NotFoundPage />
 *
 * @example
 * // With custom navigation
 * <NotFoundPage
 *   onBackClick={() => navigate(-1)}
 *   onHomeClick={() => navigate('/')}
 * />
 *
 * @example
 * // With MicroLink for micro-app navigation
 * <NotFoundPage
 *   LinkComponent={MicroLink}
 *   homePath="/"
 * />
 */
export function NotFoundPage({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  path,
  icon,
  showHomeButton = true,
  showBackButton = true,
  homePath = "/",
  onHomeClick,
  onBackClick,
  LinkComponent,
  actions,
}: NotFoundPageProps) {
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const homeButton = showHomeButton && (
    <>
      {LinkComponent ? (
        <LinkComponent to={homePath} className="inline-block">
          <Button variant="default" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </LinkComponent>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={onHomeClick}
        >
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      )}
    </>
  );

  const backButton = showBackButton && (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleBack}>
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
              {icon ?? <span className="text-4xl">🔍</span>}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">{title}</h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-2">{description}</p>

            {/* Path info */}
            {path && (
              <p className="text-xs text-muted-foreground mb-4">
                Requested path:{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                  {path}
                </code>
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {backButton}
              {homeButton}
              {actions}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
