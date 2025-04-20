export const dynamic = "force-dynamic";

import { RolesManagementView } from "@/components/admin/roles-management-view";
import { getCurrentUser, hasPermissions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RolesManagementPage() {
  const user = await getCurrentUser();
  const canManageRoles = await hasPermissions(
    ["create", "read", "update", "delete"],
    ["roles"]
  );

  const currentOrg = user?.memberships?.find((m) => m.isCurrent);
  if (!user || !currentOrg || !canManageRoles) {
    redirect("/dashboard");
  }

  return <RolesManagementView />;
}
