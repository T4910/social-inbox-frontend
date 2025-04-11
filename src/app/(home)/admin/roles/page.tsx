import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RolesManagementView } from "@/components/admin/roles-management-view"

export default async function RolesManagementPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "administrator") {
    redirect("/dashboard")
  }

  return <RolesManagementView />
}
