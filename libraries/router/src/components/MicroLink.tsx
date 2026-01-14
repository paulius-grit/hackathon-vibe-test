import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link as TanStackLink } from "@tanstack/react-router";
import { useBasePath } from "../context/BasePathContext";

type TanStackLinkProps = ComponentPropsWithoutRef<typeof TanStackLink>;

export interface MicroLinkProps extends Omit<TanStackLinkProps, "to"> {
  /** The path to navigate to (relative to micro-app's base path) */
  to: string;
  /** If true, treat the path as absolute (bypass base path) */
  absolute?: boolean;
}

/**
 * A Link component that automatically prepends the micro-app's base path.
 * Use this instead of TanStack's Link within micro-apps.
 */
export const MicroLink = forwardRef<HTMLAnchorElement, MicroLinkProps>(
  function MicroLink({ to, absolute = false, ...props }, ref) {
    const { resolvePath } = useBasePath();

    const resolvedPath = absolute ? to : resolvePath(to);

    return <TanStackLink ref={ref} to={resolvedPath} {...props} />;
  }
);
