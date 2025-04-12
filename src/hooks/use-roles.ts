import { createRole, deleteRole, getRoles, updateRole } from "@/lib/roles";
import { type Role } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoles() {
  const queryClient = useQueryClient();

  const { data: allRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  const createRoleMutation = useMutation({
    mutationFn: (role: Omit<Role, "id">) => createRole(role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (role: Role) => updateRole(role),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", role.id] });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: (_, roleId) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", roleId] });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  return {
    roles: allRoles,
    createRole: createRoleMutation.mutate,
    createRoleLoading: createRoleMutation.isPending,
    createRoleError: createRoleMutation.isError,
    createRoleErrorData: createRoleMutation.error,
    createRoleSuccess: createRoleMutation.isSuccess,
    createRoleClearError: () => createRoleMutation.reset(),
    createRoleClearSuccess: () => createRoleMutation.reset(),
    updateRole: updateRoleMutation.mutate,
    updateRoleLoading: updateRoleMutation.isPending,
    updateRoleError: updateRoleMutation.isError,
    updateRoleErrorData: updateRoleMutation.error,
    updateRoleSuccess: updateRoleMutation.isSuccess,
    updateRoleClearError: () => updateRoleMutation.reset(),
    updateRoleClearSuccess: () => updateRoleMutation.reset(),
    deleteRole: deleteRoleMutation.mutate,
    deleteRoleLoading: deleteRoleMutation.isPending,
    deleteRoleError: deleteRoleMutation.isError,
    deleteRoleErrorData: deleteRoleMutation.error,
    deleteRoleSuccess: deleteRoleMutation.isSuccess,
    deleteRoleClearError: () => deleteRoleMutation.reset(),
    deleteRoleClearSuccess: () => deleteRoleMutation.reset(),
  };
}
