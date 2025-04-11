"use server"

import { cookies } from "next/headers"
import { type User } from "./data"

// In a real application, this would be a database query
export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get("auth_token")?.value

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ token }),
  })
  const data = await res.json() as { status: number, data?: User, message?: string }

  if (data.status !== 200 || !data.data) {
    return null
  }

  return data.data || null
}

export async function login(email: string, password: string): Promise<{ message: string, status: number} | null> {
  // In a real application, this would validate credentials against a database
  // For this mock, we'll just check if the email exists and set a cookie

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  const { status, message: token } = await res.json() as { message: string, status: number }

  if (status === 200) {
    // Set a cookie to simulate authentication
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { message: "User login successfully", status }
  }

  return null
}

export async function register(email: string, password: string, confirmPassword: string): Promise<{ message: string, status: number} | null> {
  // In a real application, this would validate credentials against a database
  // For this mock, we'll just check if the email exists and set a cookie
  if (password !== confirmPassword) {
    return { message: "Passwords do not match", status: 400 }
  }

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  const { status, message: token } = await res.json() as { message: string, status: number }

  if (status === 200) {
    // Set a cookie to simulate authentication
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { message: "User registered successfully", status }
  }

  return null
}

export async function logout(): Promise<void> {
  const cookie = await cookies()

  cookie.delete("auth_token")
}

// export async function hasPermission(resource: string, action: string): Promise<boolean> {
//   const user = await getCurrentUser()

//   if (!user) {
//     return false
//   }

//   // In a real application, this would check against a permissions database
//   // For this mock, we'll use simple role-based permissions

//   if (user.role === "administrator") {
//     return true
//   }

//   if (user.role === "editor") {
//     if (resource === "tasks" && ["create", "read", "update"].includes(action)) {
//       return true
//     }
//     if (resource === "projects" && ["read", "update"].includes(action)) {
//       return true
//     }
//     if (resource === "users" && action === "read") {
//       return true
//     }
//   }

//   if (user.role === "viewer") {
//     if ((resource === "tasks" || resource === "projects" || resource === "users") && action === "read") {
//       return true
//     }
//   }

//   return false
// }
