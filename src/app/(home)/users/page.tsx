import { UsersOverviewView } from "@/components/users/users-overview-view";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <UsersOverviewView />;
}
