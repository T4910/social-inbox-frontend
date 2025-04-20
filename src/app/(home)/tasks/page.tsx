export const dynamic = "force-dynamic";

import { TasksView } from "@/components/tasks/tasks-view";
import { getCurrentUser, hasPermissions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const user = await getCurrentUser();
  const canManageTasks = await hasPermissions(["read"], ["tasks"]);

  const currentOrg = user?.memberships?.find((m) => m.isCurrent);
  if (!user || !currentOrg || !canManageTasks) {
    redirect("/dashboard");
  }

  return <TasksView user={user} />;
}
