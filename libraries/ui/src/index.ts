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
export {
  NotFoundPage,
  type NotFoundPageProps,
} from "./components/NotFoundPage";

// Form Components
export { Input, type InputProps } from "./components/Input";
export { Label, type LabelProps } from "./components/Label";
export { Textarea, type TextareaProps } from "./components/Textarea";
export { Switch, type SwitchProps } from "./components/Switch";
export { Select, SelectOption, type SelectProps } from "./components/Select";

// Dialog Components
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
  type DialogTriggerProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
} from "./components/Dialog";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps,
  type AlertDialogTriggerProps,
  type AlertDialogContentProps,
  type AlertDialogHeaderProps,
  type AlertDialogFooterProps,
  type AlertDialogTitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
} from "./components/AlertDialog";

// Table Components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/Table";

// Dropdown Menu Components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
} from "./components/DropdownMenu";

// Icons - re-export from lucide-react for convenience
export {
  // Navigation
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  Shield,
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
  Container,
  // Actions
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Save,
  Loader2,
  AlertCircle,
  Check,
  type LucideIcon,
} from "lucide-react";

// Utilities
export { cn } from "./lib/utils";
