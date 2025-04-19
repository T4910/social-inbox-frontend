import { UserProfileView } from "@/components/users/user-profile-view";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Optionally, fetch the profile user by id here if not self
  return <UserProfileView userId={params.id} currentUser={user} />;
}
