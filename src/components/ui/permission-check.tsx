import { useCheckPermissions } from "@/hooks/use-auth";

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
  const { isAllowed } = useCheckPermissions(actions, resources); // This is to keep the permissions in sync with the server

  if (isAllowed === null) return null;
  return isAllowed ? <>{children}</> : <>{fallback}</>;
}
