import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Switch,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
} from "@mf-hub/ui";
import { MicroLink } from "@mf-hub/router";
import type { RemoteApp } from "../types/remote-app";
import { deleteRemoteApp, toggleRemoteAppActive } from "../api/remote-apps";

interface AppsTableProps {
  apps: RemoteApp[];
  onRefresh: () => void;
}

export function AppsTable({ apps, onRefresh }: AppsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<RemoteApp | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleToggleActive = async (app: RemoteApp) => {
    setIsToggling(app.id);
    try {
      await toggleRemoteAppActive(app.id);
      onRefresh();
    } catch (error) {
      console.error("Failed to toggle app status:", error);
    } finally {
      setIsToggling(null);
    }
  };

  const handleDeleteClick = (app: RemoteApp) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRemoteApp(appToDelete.id);
      setDeleteDialogOpen(false);
      setAppToDelete(null);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete app:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-mono text-sm">{app.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{app.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {app.icon}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {app.url}
                </code>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={app.isActive}
                    onCheckedChange={() => handleToggleActive(app)}
                    disabled={isToggling === app.id}
                  />
                  <Badge variant={app.isActive ? "default" : "secondary"}>
                    {app.isActive ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <MicroLink to={`/edit/${app.id}`}>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </MicroLink>
                    <DropdownMenuItem
                      onClick={() => window.open(app.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open URL
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDeleteClick(app)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{appToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
