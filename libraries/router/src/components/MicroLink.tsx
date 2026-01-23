import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link as TanStackLink } from "@tanstack/react-router";

type TanStackLinkProps = ComponentPropsWithoutRef<typeof TanStackLink>;

export interface MicroLinkProps extends Omit<TanStackLinkProps, "to"> {
  /** The path to navigate to (relative to micro-app's base path) */
  to: string;
}

/**
 * A Link component for use within micro-apps.
 *
 * The path should be relative to the micro-app's routes (e.g., "/" for home, "/info" for info page).
 * The router's basepath configuration handles the URL prefixing automatically.
 *
 * @example
 * // In a micro-app mounted at /apps/demo-app
 * <MicroLink to="/">Home</MicroLink>      // Navigates to /apps/demo-app/
 * <MicroLink to="/info">Info</MicroLink>  // Navigates to /apps/demo-app/info
 */
export const MicroLink = forwardRef<HTMLAnchorElement, MicroLinkProps>(
  function MicroLink({ to, ...props }, ref) {
    // Pass the path directly to TanStackLink - the router's basepath handles URL prefixing
    return <TanStackLink ref={ref} to={to} {...props} />;
  },
);
