import { TaskDetailView } from "@/components/tasks/task-detail-view"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <>Task Detials vEiw </>
  // return <TaskDetailView taskId={(await params).id} user={user} />
}
