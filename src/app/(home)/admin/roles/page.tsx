import { RolesManagementView } from "@/components/admin/roles-management-view"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RolesManagementPage() {
  const user = await getCurrentUser()

  if (!user || user.roles[0].name !== "administrator") {
    redirect("/dashboard")
  }

  return <RolesManagementView />
}
