"use server"

import { User } from "./data"

// import { users, type User } from "./data"

// In a real application, this would be a database query
export async function getCurrentUser(): Promise<User | null> {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8787"
  
  try {
    const response = await fetch(`${backendUrl}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    })
    
    const user  = await response.json() as User
  
    if (!user) {
      return null
    }
  
    return user
    
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export async function login(email: string, password: string): Promise<{ message: string, status: number} | null> {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8787"
  // In a real application, this would validate credentials against a database
  // For this mock, we'll just check if the email exists and set a cookie

  try {
    
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
  
    const data = await response.json()
  
    if(data.status === 200) return {
      message: data.message,
      status: data.status,
    }
  
    return null
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export async function register(email: string, password: string, confirmPassword: string): Promise<{ message: string, status: number} | null> {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8787"
  // In a real application, this would validate credentials against a database
  // For this mock, we'll just check if the email exists and set a cookie
  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
      status: 400,
    }
  }

  const response = await fetch(`${backendUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if(data.status === 200) return {
    message: data.message,
    status: data.status,
  }

  return null
}

export async function logout(): Promise<void> {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8787"
  // In a real application, this would clear the session or token
  // For this mock, we'll just delete the cookie
  await fetch(`${backendUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}

export async function hasPermission(resource: string, action: string): Promise<boolean> {
  const user = await getCurrentUser()

  console.log(resource, action, user)

  if (!user) {
    return false
  }

  // In a real application, this would check against a permissions database
  // For this mock, we'll use simple role-based permissions

  // if (user.role === "administrator") {
  //   return true
  // }

  // if (user.role === "editor") {
  //   if (resource === "tasks" && ["create", "read", "update"].includes(action)) {
  //     return true
  //   }
  //   if (resource === "projects" && ["read", "update"].includes(action)) {
  //     return true
  //   }
  //   if (resource === "users" && action === "read") {
  //     return true
  //   }
  // }

  // if (user.role === "viewer") {
  //   if ((resource === "tasks" || resource === "projects" || resource === "users") && action === "read") {
  //     return true
  //   }
  // }

  return false
}
