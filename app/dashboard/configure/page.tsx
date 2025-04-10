"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Facebook, Instagram, Linkedin, MessageSquare, Plus, Settings, Trash2, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DashboardNav } from "@/components/dashboard-nav"

export default function ConfigurePage() {
  const router = useRouter()
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "twitter",
      name: "Company Twitter",
      handle: "@companyname",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
    },
    {
      id: "2",
      platform: "instagram",
      name: "Marketing Instagram",
      handle: "@company_marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
    },
  ])

  const handleConnect = (platform: string) => {
    // Simulate connecting a new account
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform,
      name: `New ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      handle: `@new_${platform}_account`,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
    }

    setConnectedAccounts([...connectedAccounts, newAccount])
  }

  const handleDisconnect = (id: string) => {
    setConnectedAccounts(connectedAccounts.filter((account) => account.id !== id))
  }

  const handleContinue = () => {
    router.push("/dashboard/inbox")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SocialInbox</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">JD</div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configure Your Accounts</h1>
              <p className="text-muted-foreground mt-2">
                Connect your social media accounts to start managing your messages in one place.
              </p>
            </div>

            <Alert>
              <AlertDescription>
                You need to connect at least one social media account to use the inbox features.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="accounts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
                <TabsTrigger value="connect">Connect New Account</TabsTrigger>
              </TabsList>
              <TabsContent value="accounts" className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold">Your Connected Accounts</h2>
                {connectedAccounts.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No accounts connected yet. Connect your first account to get started.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {connectedAccounts.map((account) => (
                      <Card key={account.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative h-10 w-10">
                                <Image
                                  src={account.avatar || "/placeholder.svg"}
                                  alt={account.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                                  {getPlatformIcon(account.platform, "h-4 w-4")}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium">{account.name}</h3>
                                <p className="text-sm text-muted-foreground">{account.handle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={account.status === "active" ? "default" : "outline"}>
                                {account.status === "active" ? "Active" : "Reconnect needed"}
                              </Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleDisconnect(account.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="connect" className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold">Connect a New Account</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {socialPlatforms.map((platform) => (
                    <Card key={platform.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <CardDescription>{platform.description}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" onClick={() => handleConnect(platform.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button onClick={handleContinue} disabled={connectedAccounts.length === 0}>
                Continue to Inbox
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface SocialAccount {
  id: string
  platform: string
  name: string
  handle: string
  avatar: string
  status: "active" | "reconnect"
}

const socialPlatforms = [
  {
    id: "twitter",
    name: "Twitter",
    description: "Connect your Twitter account to manage tweets and direct messages.",
    icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />,
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect your Facebook page to manage comments and messages.",
    icon: <Facebook className="h-5 w-5 text-[#1877F2]" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram account to manage comments and DMs.",
    icon: <Instagram className="h-5 w-5 text-[#E4405F]" />,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect your LinkedIn page to manage comments and messages.",
    icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Connect your YouTube channel to manage video comments.",
    icon: <Youtube className="h-5 w-5 text-[#FF0000]" />,
  },
]

function getPlatformIcon(platform: string, className: string) {
  switch (platform) {
    case "twitter":
      return <Twitter className={className} />
    case "facebook":
      return <Facebook className={className} />
    case "instagram":
      return <Instagram className={className} />
    case "linkedin":
      return <Linkedin className={className} />
    case "youtube":
      return <Youtube className={className} />
    default:
      return <MessageSquare className={className} />
  }
}
