import { AppSidebar } from "@/components/app-sidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
        <AppSidebar />
        {children}
    </>
  )
}


