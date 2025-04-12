export type User = {
  id: string;
  email: string;
  roles: { name: "administrator" | "editor" | "viewer" | string }[];
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  createdById: string;
  createdAt: string;
  dueDate: string | null;
  // tags: string[]
  comments: TaskComment[];
};

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type Permission = {
  resource: "tasks" | "users" | "roles";
  action: "create" | "read" | "update" | "delete";
};

export type BackendResponse<T> =
  | {
      data: T;
      status: 200 | 201 | 204;
      ok: true;
    }
  | {
      message: string;
      status: 400 | 404 | 401 | 403 | 500 | 503;
      ok: false;
    };
