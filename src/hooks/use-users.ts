import { useAuth } from "@/hooks/use-auth";
import { type User } from "@/lib/types";
import {
  deleteUser,
  getAllUsers,
  getUserById as getUserByIdServer,
  updateUser,
} from "@/lib/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const organizationId = user?.memberships?.find((m) => m.isCurrent)
    ?.organizationId!;

  const { data: allUsers } = useQuery({
    queryKey: ["users", organizationId],
    queryFn: () => getAllUsers(organizationId),
    enabled: !!organizationId,
  });

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => updateUser(user.id, user, organizationId),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["users", organizationId, user.id],
      });
    },
    onError: (error) => console.error("Error updating user:", error),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId, organizationId),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["users", organizationId, user.id],
      });
    },
    onError: (error) => console.error("Error deleting user:", error),
  });

  return {
    users: allUsers,
    updateUser: updateUserMutation.mutate,
    updateUserLoading: updateUserMutation.isPending,
    updateUserError: updateUserMutation.isError,
    updateUserErrorData: updateUserMutation.error,
    updateUserSuccess: updateUserMutation.isSuccess,
    updateUserClearError: () => updateUserMutation.reset(),
    updateUserClearSuccess: () => updateUserMutation.reset(),
    deleteUser: deleteUserMutation.mutate,
    deleteUserLoading: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.isError,
    deleteUserErrorData: deleteUserMutation.error,
    deleteUserSuccess: deleteUserMutation.isSuccess,
    deleteUserClearError: () => deleteUserMutation.reset(),
    deleteUserClearSuccess: () => deleteUserMutation.reset(),
  };
}

export const useUserById = (id: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const organizationId = user?.memberships?.find((m) => m.isCurrent)
    ?.organizationId!;
  const allUsers = queryClient.getQueryData<User[]>(["users", organizationId]);

  const { data: userData } = useQuery({
    queryKey: ["users", organizationId, id],
    queryFn: () => getUserByIdServer(id, organizationId),
    enabled: !!id && !!organizationId,
    initialData: allUsers?.find((user) => user.id === id),
  });

  return { user: userData };
};
