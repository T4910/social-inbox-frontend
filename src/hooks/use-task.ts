import {
  // addCommentToTask,
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

  const { data: allTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllTasks(),
  });

  const useTaskById = (id: string) => {
    const { data: task } = useQuery({
      queryKey: ["tasks", id],
      queryFn: () => getTaskByIdServer(id),
      enabled: !!id,
      initialData: allTasks?.find((task) => task.id === id),
    });

    return { task };
  };

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, "id">) => createTask(task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task: Task) => updateTask(task),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", task.id] });
    },
    onError: (error) => console.error("Error adding to cart:", error),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", task.id] });
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
  //   const queryClient = useQueryClient();

  const { data: allUserTasks } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: () => getTaskByAssigneeId(userId),
  });

  return {
    tasks: allUserTasks,
    // createTask: createTaskMutation.mutate,
    // createTaskLoading: createTaskMutation.isPending,
    // createTaskError: createTaskMutation.isError,
    // createTaskErrorData: createTaskMutation.error,
    // createTaskSuccess: createTaskMutation.isSuccess,
    // createTaskClearError: () => createTaskMutation.reset(),
    // createTaskClearSuccess: () => createTaskMutation.reset(),
  };
}
