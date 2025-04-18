"use server";

import { BackendResponse, Task, TaskComment } from "./types";
const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all tasks (scoped)
export async function getAllTasks(organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/tasks?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<Task[]>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }
  return data.data;
}

// get task by id (scoped)
export async function getTaskById(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/tasks/${id}?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<Task>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch task");
  }
  return data.data;
}

// get task by assignee id (scoped)
export async function getTaskByAssigneeId(
  assigneeId: string,
  organizationId: string
) {
  const res = await fetch(
    `${backendUrl}/api/tasks?assigneeId=${assigneeId}&organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<Task[]>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }
  return data.data;
}

// create new task (scoped)
export async function createTask(
  task: Omit<Task, "id"> & { organizationId: string }
) {
  const res = await fetch(`${backendUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = (await res.json()) as BackendResponse<Task>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to create task");
  }
  return data.data;
}

// update task (scoped)
export async function updateTask(task: Task & { organizationId: string }) {
  const res = await fetch(`${backendUrl}/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = (await res.json()) as BackendResponse<Task>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to update task");
  }
  return data.data;
}

// delete task (scoped)
export async function deleteTask(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/tasks/${id}?organizationId=${organizationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = (await res.json()) as BackendResponse<Task>;
  if (!data.ok) {
    throw new Error(data.message || "Failed to delete task");
  }
  return data.data;
}

// add comment to task
export async function addCommentToTask(
  taskId: string,
  comment: { userId: string; content: string }
) {
  const res = await fetch(`${backendUrl}/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  const data = (await res.json()) as BackendResponse<TaskComment>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to add comment to task");
  }

  return data.data;
}

// get all comments for task
export async function getCommentsForTask(taskId: string) {
  const res = await fetch(`${backendUrl}/api/tasks/${taskId}/comments`);
  const data = (await res.json()) as BackendResponse<TaskComment[]>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch comments for task");
  }

  return data.data;
}

// delete comment from task
export async function deleteCommentFromTask(taskId: string, commentId: string) {
  const res = await fetch(
    `${backendUrl}/api/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = (await res.json()) as BackendResponse<TaskComment>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to delete comment from task");
  }

  return data.data;
}
