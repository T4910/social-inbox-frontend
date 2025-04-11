import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TaskDetailView } from "@/components/tasks/task-detail-view"

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <TaskDetailView taskId={params.id} user={user} />
}
