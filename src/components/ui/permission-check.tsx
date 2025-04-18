import { hasPermissions } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

export function PermissionCheck({
  actions,
  resources,
  children,
  fallback = null,
}: {
  actions: string[];
  resources: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    hasPermissions(actions, resources).then(setAllowed);
  }, [actions, resources]);

  if (allowed === null) return null;
  return allowed ? <>{children}</> : <>{fallback}</>;
}
