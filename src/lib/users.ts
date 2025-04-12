"use server";
import { BackendResponse, type User } from "@/lib/types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// get all users
export async function getAllUsers() {
  const res = await fetch(`${backendUrl}/api/users`);
  const data = (await res.json()) as BackendResponse<User[]>;

  if (!data.ok) {
    throw new Error("Failed to fetch users");
  }

  return data.data;
}

// get user by id
export async function getUserById(id: string) {
  const res = await fetch(`${backendUrl}/api/users/${id}`);
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to fetch user");
  }

  return data.data;
}

// get user by email
// get user by role

// update user
export async function updateUser(id: string, user: Partial<User>) {
  const res = await fetch(`${backendUrl}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to update user");
  }

  return data.data;
}

// delete user
export async function deleteUser(id: string) {
  const res = await fetch(`${backendUrl}/api/users/${id}`, {
    method: "DELETE",
  });
  const data = (await res.json()) as BackendResponse<User>;

  if (!data.ok) {
    throw new Error("Failed to delete user");
  }

  return data.data;
}
