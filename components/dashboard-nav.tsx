"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Calendar, Inbox, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="group flex h-screen w-16 flex-col items-center border-r bg-background py-4 md:w-56">
      <div className="flex h-16 items-center justify-center md:justify-start md:px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="hidden text-xl font-bold md:inline-block">SocialInbox</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2 md:px-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", pathname === item.href && "bg-muted")}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:inline-block">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-2 md:px-4 w-full">
        <Link href="/dashboard/settings">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", pathname === "/dashboard/settings" && "bg-muted")}
          >
            <Settings className="h-5 w-5" />
            <span className="hidden md:inline-block">Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/inbox",
    label: "Inbox",
    icon: Inbox,
  },
  {
    href: "/dashboard/calendar",
    label: "Calendar",
    icon: Calendar,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    href: "/dashboard/team",
    label: "Team",
    icon: Users,
  },
  {
    href: "/dashboard/configure",
    label: "Configure",
    icon: Settings,
  },
]
