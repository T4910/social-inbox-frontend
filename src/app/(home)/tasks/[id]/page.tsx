import { TaskDetailView } from "@/components/tasks/task-detail-view";
import { getCurrentUser, hasPermissions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const canManageTasks = await hasPermissions(["read"], ["tasks"]);

  const currentOrg = user?.memberships?.find((m) => m.isCurrent);
  if (!user || !currentOrg || !canManageTasks) {
    redirect("/dashboard");
  }

  return (
    <TaskDetailView
      taskId={(await params).id}
      user={user}
      orgId={currentOrg.organizationId}
    />
  );
}
