import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Shield,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "@mf-hub/ui";
import { MicroLink } from "@mf-hub/router";
import { getAllRemoteApps } from "./api/remote-apps";
import type { RemoteApp } from "./types/remote-app";
import { AppsTable } from "./components/AppsTable";
import "./index.css";

/**
 * Admin App - Micro Applications Management
 * This micro app allows managing registered micro applications.
 */
export default function App() {
  const [apps, setApps] = useState<RemoteApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllRemoteApps();
      setApps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load apps");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
          <Shield className="w-3 h-3 mr-1" /> Admin Panel
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Micro Applications
        </h1>
        <p className="text-muted-foreground">
          Manage your micro-frontend applications
        </p>
      </div>

      {/* Actions Bar */}
      <div
        className="flex items-center justify-between mb-6 opacity-0 animate-fade-in"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {apps.length} {apps.length === 1 ? "app" : "apps"}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {apps.filter((a) => a.isActive).length} active
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApps}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <MicroLink to="/create">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </MicroLink>
        </div>
      </div>

      {/* Content */}
      <Card
        className="opacity-0 animate-fade-in-up"
        style={{ animationDelay: "150ms" }}
      >
        <CardHeader>
          <CardTitle>Registered Applications</CardTitle>
          <CardDescription>
            View and manage all registered micro-frontend applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={fetchApps}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first micro-frontend application.
              </p>
              <MicroLink to="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </MicroLink>
            </div>
          ) : (
            <AppsTable apps={apps} onRefresh={fetchApps} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
