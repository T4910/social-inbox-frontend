import { TasksView } from "@/components/tasks/tasks-view"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TasksPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <TasksView user={user} />
}
