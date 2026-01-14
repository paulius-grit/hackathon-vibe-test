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
} from "@mf-hub/ui";
import { MicroLink } from "@mf-hub/router";
import "../index.css";

/**
 * Module Info Page - Shows technical details about this micro-app
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
          Federation configuration for this micro-app
        </p>
      </div>

      {/* Back Link */}
      <MicroLink
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors opacity-0 animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calendar
      </MicroLink>

      {/* Module Info Card */}
      <Card
        className="mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <CardTitle>Federation Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <InfoRow label="App Name" value="calendar-app" />
            <Separator />
            <InfoRow label="Scope" value="calendarApp" />
            <Separator />
            <InfoRow label="Exposed Module" value="./routes" />
            <Separator />
            <InfoRow label="Port" value="3002" />
            <Separator />
            <InfoRow label="Shared Dependencies" value="react, react-dom" />
          </div>
        </CardContent>
      </Card>

      {/* Architecture Card */}
      <Card
        className="mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <InfoRow label="Framework" value="React 18" />
            <Separator />
            <InfoRow label="Build Tool" value="Vite 5" />
            <Separator />
            <InfoRow
              label="Federation Plugin"
              value="@originjs/vite-plugin-federation"
            />
            <Separator />
            <InfoRow label="Routing" value="@mf-hub/router" />
            <Separator />
            <InfoRow label="UI Library" value="@mf-hub/ui" />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div
        className="text-center py-4 text-sm text-muted-foreground opacity-0 animate-fade-in"
        style={{ animationDelay: "300ms" }}
      >
        <p className="flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Successfully loaded from{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            http://localhost:3002
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
