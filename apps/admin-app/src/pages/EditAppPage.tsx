import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectOption,
  Skeleton,
  ArrowLeft,
  Save,
  Loader2,
  Shield,
  AlertCircle,
} from "@mf-hub/ui";
import { MicroLink, useMicroNavigate } from "@mf-hub/router";
import { getRemoteAppById, updateRemoteApp } from "../api/remote-apps";
import type { UpdateRemoteAppInput, RemoteApp } from "../types/remote-app";
import "../index.css";

const ICON_OPTIONS = [
  "Package",
  "Target",
  "Calendar",
  "Plug",
  "Rocket",
  "Sparkles",
  "Zap",
  "Box",
  "Compass",
  "Settings",
  "Star",
];

interface EditAppPageProps {
  appId: string;
}

/**
 * Edit Application Page
 */
export default function EditAppPage({ appId }: EditAppPageProps) {
  const navigate = useMicroNavigate();
  const [app, setApp] = useState<RemoteApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateRemoteAppInput>({});

  useEffect(() => {
    const fetchApp = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await getRemoteAppById(appId);
        setApp(data);
        setFormData({
          name: data.name,
          title: data.title,
          icon: data.icon,
          url: data.url,
          scope: data.scope,
          module: data.module,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        });
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load app");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApp();
  }, [appId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? parseInt(value) || 0 : value,
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateRemoteApp(appId, formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update app");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto font-sans">
        <div className="text-center mb-8">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto font-sans">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load</h3>
          <p className="text-muted-foreground mb-4">{loadError}</p>
          <MicroLink to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
          </MicroLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Shield className="w-3 h-3 mr-1" /> Edit Application
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {app?.title}
        </h1>
        <p className="text-muted-foreground">Update application configuration</p>
      </div>

      {/* Back Link */}
      <MicroLink
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors opacity-0 animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </MicroLink>

      {/* Form Card */}
      <Card
        className="opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Update the remote module federation configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="my-app"
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  required
                  pattern="^[a-z0-9-]+$"
                  title="Lowercase letters, numbers, and hyphens only"
                />
                <p className="text-xs text-muted-foreground">
                  URL-safe identifier (lowercase, hyphens)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="My Application"
                  value={formData.title ?? ""}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Display name in sidebar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Remote URL *</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="http://localhost:3001/assets/remoteEntry.js"
                  value={formData.url ?? ""}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL to the remoteEntry.js file
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Scope *</Label>
                <Input
                  id="scope"
                  name="scope"
                  placeholder="my-app"
                  value={formData.scope ?? ""}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Federation scope (usually app name)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Input
                  id="module"
                  name="module"
                  placeholder="./routes"
                  value={formData.module ?? ""}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Exposed module path (e.g., ./routes)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  id="icon"
                  name="icon"
                  value={formData.icon ?? "Package"}
                  onChange={handleChange}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <SelectOption key={icon} value={icon}>
                      {icon}
                    </SelectOption>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">
                  Lucide icon name for sidebar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder ?? 0}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Order in sidebar (0 = first)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={handleActiveChange}
                  />
                  <span className="text-sm">
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Show in sidebar when active
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <MicroLink to="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </MicroLink>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
