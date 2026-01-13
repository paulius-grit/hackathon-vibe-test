import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mf-hub/ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Hero Section */}
      <div className="mb-12 opacity-0 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to MF Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          This is the container application that hosts micro frontends using
          Module Federation. Build scalable, independent applications that work
          together seamlessly.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              Getting Started
            </CardTitle>
            <CardDescription>
              Learn how to use the micro frontend hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Select a micro app from the sidebar to load it dynamically. Each
              app is loaded on-demand using Module Federation, ensuring fast
              initial load times and optimal resource usage.
            </p>
          </CardContent>
        </Card>

        <Card
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🏗️</span>
              Architecture
            </CardTitle>
            <CardDescription>
              Built with modern web technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <FeatureItem
                icon="📦"
                text="Module Federation for code sharing"
              />
              <FeatureItem icon="🔄" text="Dynamic remote loading at runtime" />
              <FeatureItem
                icon="🧭"
                text="TanStack Router for type-safe navigation"
              />
              <FeatureItem icon="⚡" text="Vite for fast development" />
            </ul>
          </CardContent>
        </Card>

        <Card
          className="md:col-span-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              Features
            </CardTitle>
            <CardDescription>
              What makes this architecture powerful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-1">Independent Deployment</h4>
                <p className="text-sm text-muted-foreground">
                  Deploy micro apps independently without rebuilding the host
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-1">Shared Dependencies</h4>
                <p className="text-sm text-muted-foreground">
                  React and other libraries are shared across all apps
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-1">Runtime Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Load remotes dynamically based on API responses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-muted flex items-center justify-center text-sm">
        {icon}
      </span>
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
