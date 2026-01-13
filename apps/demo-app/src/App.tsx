import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Separator,
} from "@mf-hub/ui";
import "./index.css";

/**
 * Demo App - Exposed via Module Federation
 * This component is loaded dynamically by the container app.
 */
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
          🎯 Remote App
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Demo Application
        </h1>
        <p className="text-muted-foreground">
          This micro app is loaded via Module Federation
        </p>
      </div>

      {/* Counter Card */}
      <Card
        className="mb-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <CardTitle>Interactive Counter</CardTitle>
          <CardDescription>
            This demonstrates that state works correctly in federated modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 text-xl"
              onClick={() => setCount((c) => c - 1)}
            >
              −
            </Button>
            <span className="text-4xl font-semibold min-w-[80px] text-center tabular-nums">
              {count}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 text-xl"
              onClick={() => setCount((c) => c + 1)}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Module Info Card */}
      <Card
        className="mb-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <CardHeader>
          <CardTitle>Module Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <InfoRow label="Scope" value="demoApp" />
            <Separator />
            <InfoRow label="Module" value="./App" />
            <Separator />
            <InfoRow label="Port" value="3001" />
            <Separator />
            <InfoRow label="Shared" value="react, react-dom" />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div
        className="text-center py-4 text-sm text-muted-foreground opacity-0 animate-fade-in"
        style={{ animationDelay: "300ms" }}
      >
        <p>
          ✅ Successfully loaded from{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            http://localhost:3001
          </code>
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{label}</span>
      <code className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {value}
      </code>
    </div>
  );
}
