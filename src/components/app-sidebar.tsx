"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { isOpen, toggle, isMobile } = useSidebar();
  const pathname = usePathname();

  const { user, logOutUser } = useAuth();

  const isAdmin = user?.roles[0].name === "administrator";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    // { name: "Team", href: "/team", icon: Users },
    ...(isAdmin
      ? [{ name: "Role Management", href: "/admin/roles", icon: Settings }]
      : []),
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600" />
          <span className="text-lg">TaskFlow</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        {/* {user && ( */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={"user.avata"} alt={user?.email} />
            <AvatarFallback>{user?.email}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.email}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.roles.map((role) =>
                user?.roles.length > 1 ? `${role.name} ,` : `${role.name}`
              )}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => logOutUser()}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
        {/* )} */}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={toggle}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "h-screen border-r transition-all duration-300",
        isOpen ? "w-64" : "w-0"
      )}
    >
      {isOpen && sidebarContent}
    </div>
  );
}
