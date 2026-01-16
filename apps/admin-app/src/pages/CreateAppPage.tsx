import { useState } from "react";
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
  ArrowLeft,
  Save,
  Loader2,
  Shield,
  AlertCircle,
} from "@mf-hub/ui";
import { MicroLink, useMicroNavigate } from "@mf-hub/router";
import { createRemoteApp } from "../api/remote-apps";
import type { CreateRemoteAppInput } from "../types/remote-app";
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

/**
 * Create Application Page
 */
export default function CreateAppPage() {
  const navigate = useMicroNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateRemoteAppInput>({
    name: "",
    title: "",
    icon: "Package",
    url: "",
    scope: "",
    module: "./routes",
    isActive: true,
    displayOrder: 0,
  });

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
      await createRemoteApp(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create app");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
          <Shield className="w-3 h-3 mr-1" /> New Application
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Add Application
        </h1>
        <p className="text-muted-foreground">
          Register a new micro-frontend application
        </p>
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
            Configure the remote module federation entry for your micro-app.
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
                  value={formData.name}
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
                  value={formData.title}
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
                  value={formData.url}
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
                  value={formData.scope}
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
                  value={formData.module}
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
                  value={formData.icon}
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
                  value={formData.displayOrder}
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
                    checked={formData.isActive}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Application
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
