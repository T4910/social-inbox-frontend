"use server";
import { BackendResponse, type User } from "@/lib/types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all users (scoped)
export async function getAllUsers(organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/users?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<User[]>;

  if (!data.ok) {
    throw new Error("Failed to fetch users");
  }

  return data.data;
}

// get user by id (scoped)
export async function getUserById(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/users/${id}?organizationId=${organizationId}`
  );
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to fetch user");
  }

  return data.data;
}

// get user by email
// get user by role

// update user (scoped)
export async function updateUser(
  id: string,
  user: Partial<User>,
  organizationId: string
) {
  const res = await fetch(
    `${backendUrl}/api/users/${id}?organizationId=${organizationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to update user");
  }

  return data.data;
}

// delete user (scoped)
export async function deleteUser(id: string, organizationId: string) {
  const res = await fetch(
    `${backendUrl}/api/users/${id}?organizationId=${organizationId}`,
    {
      method: "DELETE",
    }
  );
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to delete user");
  }

  return data.data;
}
