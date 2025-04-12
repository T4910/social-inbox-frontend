import { QueryProvider } from "@/components/query-provider";
import { SidebarProvider } from "@/components/sidebar-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskFlow - Task Management Application - By Emmanuel Taiwo",
  description:
    "A real-time task management application with role-based access control and user authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SidebarProvider>
              {children}
              <Toaster />
            </SidebarProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
