"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Archive,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Filter,
  Flag,
  Instagram,
  Linkedin,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Twitter,
  User,
  Users,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardNav } from "@/components/dashboard-nav"

export default function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0])
  const [replyText, setReplyText] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true
    if (filter === "unread") return !message.read
    if (filter === "flagged") return message.flagged
    if (filter === "assigned") return message.assignedTo !== null
    return true
  })

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return

    // In a real app, this would send the reply to the API
    console.log(`Replying to ${selectedMessage.sender.name}: ${replyText}`)
    setReplyText("")

    // Simulate marking as read
    const updatedMessages = messages.map((msg) => (msg.id === selectedMessage.id ? { ...msg, read: true } : msg))
    setSelectedMessage({ ...selectedMessage, read: true })
  }

  const toggleFlag = (messageId: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, flagged: !msg.flagged } : msg))

    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, flagged: !selectedMessage.flagged })
    }
  }

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))

    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, read: true })
    }
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
        <div className="flex flex-1 overflow-hidden">
          {/* Message List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages" className="pl-8" />
              </div>
            </div>
            <div className="p-2 border-b flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Filter messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("all")}>All messages</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("unread")}>Unread</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("flagged")}>Flagged</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("assigned")}>Assigned to me</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="h-8">
                <Archive className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedMessage?.id === message.id ? "bg-muted" : ""
                  } ${!message.read ? "bg-primary/5" : ""}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                          {getPlatformIcon(message.platform, "h-3 w-3")}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1">
                          {message.sender.name}
                          {!message.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                        </div>
                        <div className="text-xs text-muted-foreground">{message.sender.handle}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatMessageTime(message.timestamp)}</div>
                  </div>
                  <div className="text-sm line-clamp-2">{message.content}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {message.flagged && <Flag className="h-3 w-3 text-destructive" />}
                    {message.type === "dm" && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        DM
                      </Badge>
                    )}
                    {message.type === "comment" && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        Comment
                      </Badge>
                    )}
                    {message.type === "mention" && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        Mention
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} />
                      <AvatarFallback>{selectedMessage.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {selectedMessage.sender.name}
                        <Badge variant="outline" className="font-normal">
                          {getPlatformName(selectedMessage.platform)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {selectedMessage.sender.handle}
                        <span className="text-xs">•</span>
                        <span>{formatFullDate(selectedMessage.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleFlag(selectedMessage.id)}>
                      <Flag
                        className={`h-4 w-4 ${selectedMessage.flagged ? "text-destructive fill-destructive" : ""}`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => markAsRead(selectedMessage.id)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as read
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Assign to team member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Open in {getPlatformName(selectedMessage.platform)}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <div className="bg-muted rounded-lg p-4">
                        <p>{selectedMessage.content}</p>
                        {selectedMessage.attachment && (
                          <div className="mt-3 border rounded-md overflow-hidden">
                            <Image
                              src={selectedMessage.attachment || "/placeholder.svg"}
                              width={400}
                              height={300}
                              alt="Attachment"
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedMessage.conversation &&
                      selectedMessage.conversation.map((msg, index) => (
                        <div key={index} className={`mb-4 flex ${msg.fromUser ? "justify-end" : ""}`}>
                          <div
                            className={`max-w-[80%] ${msg.fromUser ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
                          >
                            <p>{msg.content}</p>
                            <div className="text-xs mt-1 opacity-80">{formatFullDate(msg.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="max-w-3xl mx-auto">
                    <Tabs defaultValue="reply">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="reply">Reply</TabsTrigger>
                        <TabsTrigger value="note">Internal Note</TabsTrigger>
                      </TabsList>
                      <TabsContent value="reply" className="space-y-4 pt-4">
                        <Textarea
                          placeholder={`Reply to ${selectedMessage.sender.name}...`}
                          className="min-h-[100px]"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Add attachment
                          </Button>
                          <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                            Send Reply
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="note" className="space-y-4 pt-4">
                        <Textarea
                          placeholder="Add an internal note visible only to your team..."
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                          <Button>Add Note</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No message selected</h3>
                  <p className="text-muted-foreground mt-1">Select a message from the list to view its contents</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Message {
  id: string
  sender: {
    name: string
    handle: string
    avatar: string
  }
  content: string
  timestamp: Date
  platform: "twitter" | "facebook" | "instagram" | "linkedin" | "youtube"
  type: "dm" | "comment" | "mention"
  read: boolean
  flagged: boolean
  assignedTo: string | null
  attachment?: string
  conversation?: {
    content: string
    timestamp: Date
    fromUser: boolean
  }[]
}

// Sample data
const messages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Sarah Johnson",
      handle: "@sarahjohnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Hi there! I'm having an issue with my recent order #12345. The package arrived damaged. Can you help me with this?",
    timestamp: new Date(2025, 3, 10, 9, 30),
    platform: "twitter",
    type: "dm",
    read: false,
    flagged: true,
    assignedTo: null,
    conversation: [
      {
        content:
          "Hi Sarah, I'm sorry to hear about your damaged package. Can you please provide some photos of the damage?",
        timestamp: new Date(2025, 3, 10, 9, 45),
        fromUser: true,
      },
      {
        content: "Of course, here are some photos of the damaged box and product inside.",
        timestamp: new Date(2025, 3, 10, 10, 2),
        fromUser: false,
      },
    ],
  },
  {
    id: "2",
    sender: {
      name: "Michael Chen",
      handle: "@mikechen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Your new product looks amazing! When will it be available in Europe?",
    timestamp: new Date(2025, 3, 10, 8, 15),
    platform: "instagram",
    type: "comment",
    read: true,
    flagged: false,
    assignedTo: "user123",
    attachment: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    sender: {
      name: "Emily Rodriguez",
      handle: "@emilyrodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "I've been a loyal customer for years and I just want to say your customer service is outstanding!",
    timestamp: new Date(2025, 3, 9, 14, 22),
    platform: "facebook",
    type: "comment",
    read: false,
    flagged: false,
    assignedTo: null,
  },
  {
    id: "4",
    sender: {
      name: "David Wilson",
      handle: "@davidwilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Hey @companyname, can you tell me more about the sustainability initiatives you mentioned in your latest post?",
    timestamp: new Date(2025, 3, 9, 11, 5),
    platform: "twitter",
    type: "mention",
    read: true,
    flagged: false,
    assignedTo: null,
  },
  {
    id: "5",
    sender: {
      name: "Lisa Thompson",
      handle: "@lisathompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I'm interested in partnering with your brand for an upcoming campaign. Who can I speak with about this opportunity?",
    timestamp: new Date(2025, 3, 8, 16, 40),
    platform: "linkedin",
    type: "dm",
    read: true,
    flagged: true,
    assignedTo: "user456",
  },
  {
    id: "6",
    sender: {
      name: "James Anderson",
      handle: "@jamesanderson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Great video! I have a question about the features shown at 2:15. Does the premium plan include those?",
    timestamp: new Date(2025, 3, 8, 9, 12),
    platform: "youtube",
    type: "comment",
    read: false,
    flagged: false,
    assignedTo: null,
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

function getPlatformName(platform: string) {
  switch (platform) {
    case "twitter":
      return "Twitter"
    case "facebook":
      return "Facebook"
    case "instagram":
      return "Instagram"
    case "linkedin":
      return "LinkedIn"
    case "youtube":
      return "YouTube"
    default:
      return "Unknown"
  }
}

function formatMessageTime(date: Date) {
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

function formatFullDate(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
