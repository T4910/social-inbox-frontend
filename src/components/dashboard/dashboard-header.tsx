"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { switchOrganization } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function DashboardHeader() {
  const { toggle } = useSidebar();
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const [orgSwitching, setOrgSwitching] = useState(false);
  const organizations = user?.memberships || [];
  const currentOrgId =
    user?.memberships?.find((m) => m.isCurrent)?.organizationId ||
    organizations[0]?.organizationId;

  const handleSwitchOrg = async (orgId: string) => {
    setOrgSwitching(true);
    await switchOrganization(orgId);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {organizations.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="font-semibold text-orange-500">
              {organizations.find((o) => o.organizationId === currentOrgId)
                ?.organizationName || "Switch Organization"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.organizationId}
                onClick={() => handleSwitchOrg(org.organizationId)}
                className={
                  org.organizationId === currentOrgId
                    ? "bg-orange-100 text-orange-600"
                    : ""
                }
              >
                {org.organizationName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>No new notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
