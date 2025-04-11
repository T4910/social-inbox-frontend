import { AppSidebar } from "@/components/app-sidebar"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <AppSidebar />
        {children}
    </>
  )
}


