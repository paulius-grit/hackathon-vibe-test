# @mf-hub/ui

Shared UI component library for MF Hub micro-frontends.

## Installation

```bash
pnpm add @mf-hub/ui
```

## Overview

This library provides:

- **Pre-styled Components**: Button, Card, Badge, Tabs, etc.
- **Consistent Design**: Tailwind CSS-based theming
- **Icon Set**: Re-exported Lucide icons
- **Utility Functions**: Class name merging with `cn()`

## Setup

### 1. Configure Tailwind CSS

Import the UI preset in your `tailwind.config.js`:

```javascript
import uiPreset from "@mf-hub/ui/tailwind.preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiPreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include the UI library components
    "../../libraries/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
```

### 2. Import Global Styles

In your main CSS file:

```css
@import "@mf-hub/ui/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Examples:**

```tsx
import { Button } from "@mf-hub/ui";

// Variants
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// With icons
<Button>
  <ArrowRight className="mr-2 h-4 w-4" />
  Next
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Card

A container component for grouping content.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@mf-hub/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Badge

A small label component for status or categorization.

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

**Examples:**

```tsx
import { Badge } from "@mf-hub/ui";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Tabs

A tabbed interface component.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@mf-hub/ui";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
  <TabsContent value="tab3">Content for Tab 3</TabsContent>
</Tabs>;
```

### Tooltip

A hover tooltip component.

```typescript
interface TooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}
```

**Example:**

```tsx
import { Tooltip, Button } from "@mf-hub/ui";

<Tooltip content="This is a tooltip" side="right">
  <Button>Hover me</Button>
</Tooltip>;
```

### Separator

A visual divider line.

```typescript
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}
```

**Example:**

```tsx
import { Separator } from "@mf-hub/ui";

<div>
  <p>Content above</p>
  <Separator className="my-4" />
  <p>Content below</p>
</div>

<div className="flex h-5 items-center space-x-4">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>
```

### Skeleton

A loading placeholder component.

```tsx
import { Skeleton } from "@mf-hub/ui";

// Loading card
<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-32 w-full rounded-xl" />
</div>;
```

### NotFoundPage

A reusable 404 page component.

```typescript
interface NotFoundPageProps {
  title?: string;
  description?: string;
  path?: string;
  icon?: ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  homePath?: string;
  onHomeClick?: () => void;
  onBackClick?: () => void;
  LinkComponent?: ComponentType<any>;
  actions?: ReactNode;
}
```

**Examples:**

```tsx
import { NotFoundPage } from "@mf-hub/ui";

// Basic usage
<NotFoundPage />

// Custom message
<NotFoundPage
  title="Page Not Found"
  description="The requested page doesn't exist."
  path="/unknown/path"
/>

// With custom Link component (for micro-apps)
import { MicroLink } from "@mf-hub/router";

<NotFoundPage
  LinkComponent={MicroLink}
  onBackClick={() => window.history.back()}
/>

// With custom actions
<NotFoundPage
  actions={
    <Button variant="outline" onClick={handleContact}>
      Contact Support
    </Button>
  }
/>
```

## Icons

Re-exported from [Lucide React](https://lucide.dev/) for convenience:

```tsx
import {
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

  // Type for icon components
  type LucideIcon,
} from "@mf-hub/ui";

// Usage
<Home className="h-4 w-4" />
<ArrowRight className="h-6 w-6 text-blue-500" />

// Icon map example
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  settings: Settings,
  calendar: Calendar,
};
```

## Utilities

### cn (Class Name Utility)

Combines class names using `clsx` and `tailwind-merge`:

```typescript
function cn(...inputs: ClassValue[]): string;
```

**Example:**

```tsx
import { cn } from "@mf-hub/ui";

// Basic usage
<div className={cn("p-4", "bg-blue-500")} />

// Conditional classes
<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// Merging conflicting Tailwind classes
<div className={cn("p-2", "p-4")} /> // Results in "p-4"

// With component props
function MyComponent({ className, ...props }) {
  return (
    <div
      className={cn("default-styles", className)}
      {...props}
    />
  );
}
```

### buttonVariants

Export the button variant styles for use with other elements:

```tsx
import { buttonVariants } from "@mf-hub/ui";
import { Link } from "@tanstack/react-router";

// Style a Link as a button
<Link to="/about" className={buttonVariants({ variant: "outline" })}>
  About
</Link>

// With size
<a href="#" className={buttonVariants({ variant: "ghost", size: "sm" })}>
  Learn more
</a>
```

### badgeVariants

Export the badge variant styles:

```tsx
import { badgeVariants } from "@mf-hub/ui";

<span className={badgeVariants({ variant: "secondary" })}>Custom Badge</span>;
```

## Theming

The UI library uses CSS custom properties for theming. The default theme is defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

### Custom Theme

Override variables in your app's CSS:

```css
:root {
  --primary: 200 100% 50%; /* Custom blue */
  --primary-foreground: 0 0% 100%;
}
```

### Sidebar Theme

Special variables for sidebar styling:

```css
:root {
  --sidebar: 224 71.4% 4.1%;
  --sidebar-foreground: 210 20% 98%;
  --sidebar-muted: 215 27.9% 16.9%;
  --sidebar-accent: 224 64.3% 32.9%;
  --sidebar-border: 215 27.9% 16.9%;
}
```

## Complete Example

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Skeleton,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
  Home,
  Settings,
  ArrowRight,
  cn,
} from "@mf-hub/ui";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <CardDescription>Welcome to your dashboard</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <p>Overview content here</p>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <p>Settings content here</p>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between">
        <Tooltip content="Go back to home">
          <Button variant="ghost">
            <Home className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Button>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## Exports Summary

```typescript
// Components
export { Button, buttonVariants } from "./components/Button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/Card";
export { Badge, badgeVariants } from "./components/Badge";
export { Separator } from "./components/Separator";
export { Skeleton } from "./components/Skeleton";
export { Tooltip } from "./components/Tooltip";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
export { NotFoundPage } from "./components/NotFoundPage";

// Icons (from lucide-react)
export { Home, Settings, ArrowLeft, ArrowRight /* ... */ } from "lucide-react";

// Utilities
export { cn } from "./lib/utils";
```
