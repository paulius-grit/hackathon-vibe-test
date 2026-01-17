import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  CheckCircle2,
  Info,
  ArrowLeft,
  Box,
} from "@mf-hub/ui";
import { MicroLink } from "@mf-hub/router";

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-muted-foreground">{label}</span>
      <code
        className={`px-2 py-1 rounded text-sm font-mono ${
          highlight ? "bg-amber-100 text-amber-800" : "bg-muted"
        }`}
      >
        {value}
      </code>
    </div>
  );
}

/**
 * Module Info Page - Shows technical details about this webpack micro-app
 */
export default function InfoPage() {
  return (
    <div className="max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-100">
          <Info className="w-3 h-3 mr-1" /> Module Info
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Technical Details
        </h1>
        <p className="text-muted-foreground">
          Webpack Module Federation configuration
        </p>
      </div>

      {/* Back Link */}
      <MicroLink
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors opacity-0 animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Webpack Demo
      </MicroLink>

      {/* Module Info Card */}
      <Card
        className="mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <CardTitle>Federation Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow label="Bundler" value="Webpack 5" highlight />
          <Separator />
          <InfoRow label="Plugin" value="ModuleFederationPlugin" />
          <Separator />
          <InfoRow label="Remote Name" value="webpackDemoApp" />
          <Separator />
          <InfoRow label="Entry File" value="remoteEntry.js" />
          <Separator />
          <InfoRow label="Exposed Module" value="./routes" />
          <Separator />
          <InfoRow label="Port" value="3004" />
        </CardContent>
      </Card>

      {/* Shared Dependencies Card */}
      <Card
        className="mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "150ms" }}
      >
        <CardHeader>
          <CardTitle>Shared Dependencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow label="react" value="^18.3.1 (singleton)" />
          <Separator />
          <InfoRow label="react-dom" value="^18.3.1 (singleton)" />
          <Separator />
          <InfoRow label="@tanstack/react-router" value="^1.45.0 (singleton)" />
        </CardContent>
      </Card>

      {/* Interoperability Card */}
      <Card
        className="opacity-0 animate-fade-in-up border-amber-200 bg-amber-50/50"
        style={{ animationDelay: "200ms" }}
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 mt-0.5">
              <Box className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="font-medium mb-1">Webpack ↔ Vite Interop</p>
              <p className="text-sm text-muted-foreground">
                This app is built with Webpack but loaded by a Vite-based
                container. Module Federation provides a standard interface that
                works across different bundlers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div
        className="text-center py-6 opacity-0 animate-fade-in"
        style={{ animationDelay: "250ms" }}
      >
        <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Cross-bundler federation working successfully
        </p>
      </div>
    </div>
  );
}
