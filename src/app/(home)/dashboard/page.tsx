import { DashboardView } from "@/components/dashboard/dashboard-view"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardView user={user} />
}
