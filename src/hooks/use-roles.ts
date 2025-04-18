import { useAuth } from "@/hooks/use-auth";
import { createRole, deleteRole, getRoles, updateRole } from "@/lib/roles";
import { type Role } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoles() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const organizationId = user?.memberships?.find((m) => m.isCurrent)
    ?.organizationId!;

  const { data: allRoles } = useQuery({
    queryKey: ["roles", organizationId],
    queryFn: () => getRoles(organizationId),
    enabled: !!organizationId,
  });

  const createRoleMutation = useMutation({
    mutationFn: (role: Omit<Role, "id">) =>
      createRole({ ...role, organizationId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] }),
    onError: (error) => console.error("Error creating role:", error),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (role: Role) => updateRole({ ...role, organizationId }),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["roles", organizationId, role.id],
      });
    },
    onError: (error) => console.error("Error updating role:", error),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId, organizationId),
    onSuccess: (_, roleId) => {
      queryClient.invalidateQueries({ queryKey: ["roles", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["roles", organizationId, roleId],
      });
    },
    onError: (error) => console.error("Error deleting role:", error),
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
