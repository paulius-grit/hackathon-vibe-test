// Components
export { Button, type ButtonProps, buttonVariants } from "./components/Button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/Card";
export { Badge, type BadgeProps, badgeVariants } from "./components/Badge";
export { Separator, type SeparatorProps } from "./components/Separator";
export { Skeleton } from "./components/Skeleton";
export { Tooltip, type TooltipProps } from "./components/Tooltip";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from "./components/Tabs";

// Icons - re-export from lucide-react for convenience
export {
  // Navigation
  Home,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  ArrowRight,
  X,
  // Apps
  Target,
  Calendar,
  Package,
  Plug,
  // Features
  Rocket,
  Sparkles,
  Zap,
  // Architecture
  Box,
  RefreshCw,
  Compass,
  // Info
  Info,
  CheckCircle2,
  Clock,
  Settings,
  Minus,
  Plus,
  Star,
  type LucideIcon,
} from "lucide-react";

// Utilities
export { cn } from "./lib/utils";
