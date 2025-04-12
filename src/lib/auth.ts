"use server";
import { cookies } from "next/headers";
import { BackendResponse, type User } from "./types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    console.log(token, "token");
    const res = await fetch(`${backendUrl}/api/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    const data = (await res.json()) as BackendResponse<User>;

    console.log(data, "data");

    if (!data.ok) {
      return null;
    }

    return data.data || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ message: string; status: number } | null> {
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  type token = string;
  const data = (await res.json()) as BackendResponse<token>;

  if (data.ok) {
    // Set a cookie to simulate authentication
    (await cookies()).set("auth_token", data.data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { message: "User login successfully", status: 200 };
  }

  return { message: data.message || "Login failed", status: data.status };
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ message: string; status: number } | null> {
  if (password !== confirmPassword) {
    return { message: "Passwords do not match", status: 400 };
  }

  const res = await fetch(`${backendUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  type token = string;
  const data = (await res.json()) as BackendResponse<token>;

  if (data.ok) {
    // Set a cookie to simulate authentication
    (await cookies()).set("auth_token", data.data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { message: "User registered successfully", status: data.status };
  }

  return {
    message: data.message || "Registration failed",
    status: data.status,
  };
}

export async function logout(): Promise<void> {
  const cookie = await cookies();

  cookie.delete("auth_token");
}

export async function hasPermissions(
  actions: string[],
  resources: string[]
): Promise<boolean> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    const res = await fetch(`${backendUrl}/api/auth/checkPermissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token, actions, resources }),
    });
    const data = (await res.json()) as BackendResponse<boolean>;

    if (!data.ok) {
      return false;
    }

    return data.data || false;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return false;
  }
}
