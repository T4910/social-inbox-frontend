"use server";
import { cookies } from "next/headers";
import { BackendResponse } from "./types";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8787";

// create organization
export async function createOrganization(
  userId: string,
  name: string,
  invites?: string[] | null
) {
  const payload = !!invites ? { userId, name, invites } : { userId, name };

  const res = await fetch(`${backendUrl}/api/organization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as BackendResponse<{ token: string }>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to create organization");
  }

  // Set a cookie to simulate authentication
  (await cookies()).set("auth_token", data.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return {
    message: "User org registered successfully",
    data: data.data,
    status: data.status,
  };
}

export async function emailInvites(
  userId: string,
  orgId: string,
  invites: string[]
) {
  const payload = { userId, invites };

  const res = await fetch(
    `${backendUrl}/api/organization/invite?organizationId=${orgId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = (await res.json()) as BackendResponse<{ data: null }>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to send invites");
  }

  return {
    message: "Invites sent successfully",
    ok: data.ok,
    status: data.status,
  };
}

export async function acceptInvite(token: string) {
  const res = await fetch(
    `${backendUrl}/api/organization/accept-invite/${token}`,
    {
      method: "POST",
    }
  );

  const data = (await res.json()) as
    | BackendResponse<{ token: string }>
    | {
        ok: true;
        status: 404;
        data: {
          type: "register-user-first";
          message: string;
          inviteToken: string;
        };
      };

  if (!data.ok) {
    throw new Error(data.message || "Failed to accept invite");
  }

  // Handle the case where the user needs to register first
  if (data.status === 404 && data.data?.type === "register-user-first") {
    return {
      message: "register-user-first" as const,
      status: 404,
      inviteToken: data.data.inviteToken,
    };
  }

  if (!("token" in data.data)) {
    throw new Error("No token found in response data");
  }

  // Set a cookie to simulate authentication
  (await cookies()).set("auth_token", data.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return {
    message: "User org registered successfully",
    data: data.data,
    status: data.status,
  };
}

export async function validateInvite(token: string) {
  // fetch(`/api/organization/validate-invite/${token}`)

  const res = await fetch(
    `${backendUrl}/api/organization/validate-invite/${token}`
  );

  const data = (await res.json()) as BackendResponse<{
    organizationId: string;
    email: string;
  } | null>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to validate invite");
  }
  return {
    message: "Invite validated successfully",
    data: data.data,
    status: data.status,
    ok: data.ok,
  };
}

export async function validateInviteForRegister(token: string) {
  const res = await fetch(
    `${backendUrl}/api/organization/validate-invite/${token}?register=true`
  );

  const data = (await res.json()) as BackendResponse<{
    organizationId: string;
    email: string;
  } | null>;

  if (!data.ok) {
    throw new Error(data.message || "Failed to validate invite");
  }
  return {
    message: "Invite validated successfully",
    data: data.data,
    status: data.status,
    ok: data.ok,
  };
}
