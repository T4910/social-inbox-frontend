"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { hasPermission } from "@/lib/auth"
import { type Comment, getUserById, type Task, tasks, type User, users } from "@/lib/data"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ArrowLeft, MessageSquare, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface TaskDetailViewProps {
  taskId: string
  user: User
}

export function TaskDetailView({ taskId, user }: TaskDetailViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState("")

  const { data: task } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasks.find((t) => t.id === taskId),
  })

  const { data: canEdit } = useQuery({
    queryKey: ["permissions", "tasks", "update"],
    queryFn: () => hasPermission("tasks", "update"),
  })

  const { data: canDelete } = useQuery({
    queryKey: ["permissions", "tasks", "delete"],
    queryFn: () => hasPermission("tasks", "delete"),
  })

  if (!task) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold">Task not found</h2>
            <p className="text-muted-foreground">The task you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    )
  }

  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null
  const creator = getUserById(task.createdById)

  const handleStatusChange = (status: string) => {
    // In a real app, this would be an API call
    const taskIndex = tasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status as Task["status"]
      queryClient.invalidateQueries({ queryKey: ["task", taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })

      toast({
        title: "Status updated",
        description: `Task status changed to ${status}`,
      })
    }
  }

  const handlePriorityChange = (priority: string) => {
    // In a real app, this would be an API call
    const taskIndex = tasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks[taskIndex].priority = priority as Task["priority"]
      queryClient.invalidateQueries({ queryKey: ["task", taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })

      toast({
        title: "Priority updated",
        description: `Task priority changed to ${priority}`,
      })
    }
  }

  const handleAssigneeChange = (assigneeId: string) => {
    // In a real app, this would be an API call
    const taskIndex = tasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks[taskIndex].assigneeId = assigneeId
      queryClient.invalidateQueries({ queryKey: ["task", taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })

      const assignee = getUserById(assigneeId)
      toast({
        title: "Assignee updated",
        description: `Task assigned to ${assignee?.name}`,
      })
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    // In a real app, this would be an API call
    const taskIndex = tasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        taskId: task.id,
        userId: user.id,
        content: newComment,
        createdAt: new Date().toISOString(),
      }

      tasks[taskIndex].comments.push(comment)
      queryClient.invalidateQueries({ queryKey: ["task", taskId] })

      setNewComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added to the task",
      })
    }
  }

  const handleDeleteTask = () => {
    // In a real app, this would be an API call
    const taskIndex = tasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      })

      router.push("/tasks")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold">{task.title}</h1>

              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="rounded-md border p-4">
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>

                  {task.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {canEdit ? (
                  <>
                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Status</h2>
                      <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Priority</h2>
                      <Select defaultValue={task.priority} onValueChange={handlePriorityChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Assignee</h2>
                      <Select defaultValue={task.assigneeId || ""} onValueChange={handleAssigneeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Status</h2>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={task.status} />
                      </div>
                    </div>

                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Priority</h2>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>

                    <div className="rounded-md border p-4">
                      <h2 className="font-semibold mb-2">Assignee</h2>
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={"assignee.avatar"} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </>
                )}

                <div className="rounded-md border p-4">
                  <h2 className="font-semibold mb-2">Due Date</h2>
                  {task.dueDate ? (
                    <span>{format(new Date(task.dueDate), "MMMM d, yyyy")}</span>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </div>

                <div className="rounded-md border p-4">
                  <h2 className="font-semibold mb-2">Created By</h2>
                  {creator && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={"creator.avatar"} alt={creator.name} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{creator.name}</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-muted-foreground">
                    {format(new Date(task.createdAt), "MMMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h2 className="text-xl font-semibold mb-4">Comments</h2>

              <div className="space-y-4 mb-6">
                {task.comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No comments yet</div>
                ) : (
                  task.comments.map((comment) => {
                    const commentUser = getUserById(comment.userId)

                    return (
                      <div key={comment.id} className="flex gap-3">
                        {commentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={"commentUser.avatar"} alt={commentUser.name} />
                            <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{commentUser?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={"user.avatar"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Task["status"] }) {
  switch (status) {
    case "todo":
      return <Badge variant="outline">To Do</Badge>
    case "in-progress":
      return <Badge variant="secondary">In Progress</Badge>
    case "review":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          In Review
        </Badge>
      )
    case "done":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Done
        </Badge>
      )
    default:
      return null
  }
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Medium
        </Badge>
      )
    case "low":
      return <Badge variant="outline">Low</Badge>
    default:
      return null
  }
}
