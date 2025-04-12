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

  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  // const createUserMutation = useMutation({
  //   mutationFn: (user: Omit<User, "id">) => createUser(user),
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  //   onError: (error) => console.error("Error adding to cart:", error),
  // });

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => updateUser(user.id, user),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  return {
    users: allUsers,
    // createUser: createUserMutation.mutate,
    // createUserLoading: createUserMutation.isPending,
    // createUserError: createUserMutation.isError,
    // createUserErrorData: createUserMutation.error,
    // createUserSuccess: createUserMutation.isSuccess,
    // createUserClearError: () => createUserMutation.reset(),
    // createUserClearSuccess: () => createUserMutation.reset(),
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
  const allUsers = queryClient.getQueryData<User[]>(["users"]);

  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserByIdServer(id),
    enabled: !!id,
    initialData: allUsers?.find((user) => user.id === id),
  });

  return { user };
};
