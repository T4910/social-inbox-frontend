import { getCurrentUser, hasPermissions, logout } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 60 * 5, // 5 hours
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const logOutUser = async () => {
    await logout();
    queryClient.clear();
    router.push("/login");
    router.refresh();
  };

  return { user, logOutUser };
}

export function useCheckPermissions(actions: string[], resources: string[]) {
  const { data, isPending } = useQuery({
    queryKey: ["permissions", ...actions.sort(), ...resources.sort()],
    queryFn: () => hasPermissions(actions, resources),
  });

  return { isAllowed: data, isPending };
}
