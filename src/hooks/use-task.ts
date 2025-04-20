import { useAuth } from "@/hooks/use-auth";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskByAssigneeId,
  getTaskById as getTaskByIdServer,
  updateTask,
} from "@/lib/tasks";
import { type Task } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const organizationId =
    user?.memberships?.find((m) => m.isCurrent)?.organizationId || "";

  const { data: allTasks } = useQuery({
    queryKey: ["tasks", organizationId],
    queryFn: () =>
      organizationId ? getAllTasks(organizationId) : Promise.resolve([]),
    enabled: !!organizationId,
  });

  const useTaskById = (id: string) => {
    const { data: task } = useQuery({
      queryKey: ["tasks", organizationId, id],
      queryFn: () =>
        id && organizationId
          ? getTaskByIdServer(id, organizationId)
          : Promise.resolve(undefined),
      enabled: !!id && !!organizationId,
      initialData: allTasks?.find((task) => task.id === id),
    });
    return { task };
  };

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, "id">) =>
      createTask({ ...task, organizationId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", organizationId] }),
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task: Task) => updateTask({ ...task, organizationId }),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, task.id],
      });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId, organizationId || ""),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", organizationId, task.id],
      });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  return {
    tasks: allTasks,
    useTaskById,
    createTask: createTaskMutation.mutate,
    createTaskLoading: createTaskMutation.isPending,
    createTaskError: createTaskMutation.isError,
    createTaskErrorData: createTaskMutation.error,
    createTaskSuccess: createTaskMutation.isSuccess,
    createTaskClearError: () => createTaskMutation.reset(),
    createTaskClearSuccess: () => createTaskMutation.reset(),
    updateTask: updateTaskMutation.mutate,
    updateTaskLoading: updateTaskMutation.isPending,
    updateTaskError: updateTaskMutation.isError,
    updateTaskErrorData: updateTaskMutation.error,
    updateTaskSuccess: updateTaskMutation.isSuccess,
    updateTaskClearError: () => updateTaskMutation.reset(),
    updateTaskClearSuccess: () => updateTaskMutation.reset(),
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskLoading: deleteTaskMutation.isPending,
    deleteTaskError: deleteTaskMutation.isError,
    deleteTaskErrorData: deleteTaskMutation.error,
    deleteTaskSuccess: deleteTaskMutation.isSuccess,
    deleteTaskClearError: () => deleteTaskMutation.reset(),
    deleteTaskClearSuccess: () => deleteTaskMutation.reset(),
  };
}

export function useAssignedTask(userId: string) {
  const { user } = useAuth();
  const organizationId =
    user?.memberships?.find((m) => m.isCurrent)?.organizationId || "";

  const { data: allUserTasks } = useQuery({
    queryKey: ["tasks", organizationId, userId],
    queryFn: () =>
      organizationId && userId
        ? getTaskByAssigneeId(userId, organizationId)
        : Promise.resolve([]),
    enabled: !!organizationId && !!userId,
  });
  return {
    tasks: allUserTasks,
  };
}
