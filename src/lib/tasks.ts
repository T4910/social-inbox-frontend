"use server";

import { BackendResponse, Task, TaskComment } from "./types";
const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all tasks
export async function getAllTasks() {
  const res = await fetch(`${backendUrl}/api/tasks`);
  const data = (await res.json()) as BackendResponse<Task[]>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }

  return data.data;
}

// get task by id
export async function getTaskById(id: string) {
  const res = await fetch(`${backendUrl}/api/tasks/${id}`);
  const data = (await res.json()) as BackendResponse<Task>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch task");
  }

  return data.data;
}

// get task by assignee id
export async function getTaskByAssigneeId(assigneeId: string) {
  const res = await fetch(`${backendUrl}/api/tasks?assigneeId=${assigneeId}`);
  const data = (await res.json()) as BackendResponse<Task[]>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }

  return data.data;
}

// create newtask
export async function createTask(task: Omit<Task, "id">) {
  const res = await fetch(`${backendUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = (await res.json()) as BackendResponse<Task>;

  console.log(data, "data create");

  if (!data.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.data;
}

// update task
export async function updateTask(task: Task) {
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

// delete task
export async function deleteTask(id: string) {
  const res = await fetch(`${backendUrl}/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
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
