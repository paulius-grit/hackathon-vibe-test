import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { RemoteLoader } from "@/components/RemoteLoader";
import { useRemote } from "@/context/RemotesContext";
import { useLoadedApps } from "@/context/LoadedAppsContext";
import { Card, CardContent, Skeleton } from "@mf-hub/ui";

export const Route = createFileRoute("/apps/$name/$")({
  component: RemotePage,
});

function RemotePage() {
  const { name, _splat } = Route.useParams();
  const { remote, isLoading } = useRemote(name);
  const { addLoadedApp, setActiveApp } = useLoadedApps();

  // Extract the sub-path from the splat parameter
  // _splat contains everything after /apps/$name/
  const subPath = _splat ? `/${_splat}` : "/";

  useEffect(() => {
    if (remote) {
      addLoadedApp({
        name: remote.name,
        title: remote.title ?? remote.name,
        icon: remote.icon ?? "Package",
      });
      setActiveApp(remote.name);
    }
  }, [remote, addLoadedApp, setActiveApp]);

  if (isLoading) {
    return <LoadingSkeleton name={name} />;
  }

  if (!remote) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="text-lg font-semibold mb-2">Remote Not Found</h2>
              <p className="text-sm text-muted-foreground">
                The micro app "{name}" is not configured.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full">
      <RemoteLoader
        name={remote.name}
        url={remote.url}
        scope={remote.scope}
        module="./routes"
        bundler={remote.bundler}
        fallback={<LoadingSkeleton name={name} />}
        initialPath={subPath}
      />
    </div>
  );
}

function LoadingSkeleton({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-16">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-4">
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground animate-pulse">
        Loading {name}...
      </p>
    </div>
  );
}
