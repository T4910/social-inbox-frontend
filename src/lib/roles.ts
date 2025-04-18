"use server";
import { BackendResponse, type Role } from "@/lib/types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all roles (scoped)
export async function getRoles(organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/roles?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<Role[]>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch roles");
  }

  return data.data;
}

// get role by id (scoped)
export async function getRoleById(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/roles/${id}?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<Role>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to fetch role");
  }

  return data.data;
}

// create role (scoped)
export async function createRole(
  role: Omit<Role, "id"> & { organizationId: string }
) {
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

// update role (scoped)
export async function updateRole(role: Role & { organizationId: string }) {
  const res = await fetch(
    `${backendUrl}/api/roles/${role.id}?organizationId=${role.organizationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    }
  );
  const data = (await res.json()) as BackendResponse<Role>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to update role");
  }

  return data.data;
}

// delete role (scoped)
export async function deleteRole(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/roles/${id}?organizationId=${organizationId}`,
    {
      method: "DELETE",
    }
  );
  const data = (await res.json()) as BackendResponse<{ message: string }>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to delete role");
  }

  return data.data;
}
