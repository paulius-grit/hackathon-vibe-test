import { useRef, useState, useEffect } from "react";
import { cn } from "../lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  delayDuration?: number;
}

function Tooltip({
  content,
  children,
  side = "right",
  sideOffset = 8,
  delayDuration = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;

        switch (side) {
          case "right":
            x = rect.right + sideOffset;
            y = rect.top + rect.height / 2;
            break;
          case "left":
            x = rect.left - sideOffset;
            y = rect.top + rect.height / 2;
            break;
          case "top":
            x = rect.left + rect.width / 2;
            y = rect.top - sideOffset;
            break;
          case "bottom":
            x = rect.left + rect.width / 2;
            y = rect.bottom + sideOffset;
            break;
        }

        setPosition({ x, y });
        setIsVisible(true);
      }
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
    };

    switch (side) {
      case "right":
        return {
          ...base,
          left: position.x,
          top: position.y,
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          ...base,
          right: `calc(100vw - ${position.x}px)`,
          top: position.y,
          transform: "translateY(-50%)",
        };
      case "top":
        return {
          ...base,
          left: position.x,
          bottom: `calc(100vh - ${position.y}px)`,
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          ...base,
          left: position.x,
          top: position.y,
          transform: "translateX(-50%)",
        };
    }
  };

  const tooltipStyles = getTooltipStyles();

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          style={tooltipStyles}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md shadow-md",
            "bg-primary text-primary-foreground",
            "animate-fade-in"
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
}

export { Tooltip, type TooltipProps };
