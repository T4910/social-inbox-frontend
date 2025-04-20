export const dynamic = "force-dynamic";

import { DashboardView } from "@/components/dashboard/dashboard-view";
// import { PermissionCheck } from "@/components/ui/permission-check";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Optionally, restrict dashboard access to users with at least read permission on tasks
  // If you want to allow all authenticated users, you can skip this check
  // Otherwise, use PermissionCheck in the DashboardView for sensitive actions/widgets
  return <DashboardView user={user} />;
}
