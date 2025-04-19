import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

export default AuthLayout;
