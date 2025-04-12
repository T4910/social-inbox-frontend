"use server";
import { BackendResponse, type Role } from "@/lib/types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all roles
export async function getRoles() {
  const res = await fetch(`${backendUrl}/api/roles`);
  const data = (await res.json()) as BackendResponse<Role[]>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch roles");
  }

  return data.data;
}

// get role by id
export async function getRoleById(id: string) {
  const res = await fetch(`${backendUrl}/api/roles/${id}`);
  const data = (await res.json()) as BackendResponse<Role>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch role");
  }

  return data.data;
}

// create role
export async function createRole(role: Omit<Role, "id">) {
  const res = await fetch(`${backendUrl}/api/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(role),
  });
  const data = (await res.json()) as BackendResponse<Role>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to create role");
  }

  return data.data;
}

// update role
export async function updateRole(role: Role) {
  const res = await fetch(`${backendUrl}/api/roles/${role.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(role),
  });
  const data = (await res.json()) as BackendResponse<Role>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to update role");
  }

  return data.data;
}

// delete role
export async function deleteRole(id: string) {
  const res = await fetch(`${backendUrl}/api/roles/${id}`, {
    method: "DELETE",
  });
  const data = (await res.json()) as BackendResponse<{ message: string }>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to delete role");
  }

  return data.data;
}
