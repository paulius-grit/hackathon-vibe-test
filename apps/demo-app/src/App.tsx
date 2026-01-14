import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Target,
  Minus,
  Plus,
  CheckCircle2,
  Info,
} from "@mf-hub/ui";
import { MicroLink } from "@mf-hub/router";
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
          <Target className="w-3 h-3 mr-1" /> Remote App
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
              className="h-12 w-12"
              onClick={() => setCount((c) => c - 1)}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <span className="text-4xl font-semibold min-w-[80px] text-center tabular-nums">
              {count}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setCount((c) => c + 1)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div
        className="text-center py-4 text-sm text-muted-foreground opacity-0 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        <p className="flex items-center justify-center gap-1.5 mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Successfully loaded from{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            http://localhost:3001
          </code>
        </p>
        <MicroLink
          to="/info"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="w-4 h-4" />
          View Module Info
        </MicroLink>
      </div>
    </div>
  );
}
