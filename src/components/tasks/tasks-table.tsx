"use client"

import { useState } from "react"
import Link from "next/link"
import { type Task, getUserById } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TasksTableProps {
  tasks: Task[]
}

type SortField = "title" | "status" | "priority" | "dueDate" | "assigneeId"
type SortDirection = "asc" | "desc"

export function TasksTable({ tasks }: TasksTableProps) {
  const [sortField, setSortField] = useState<SortField>("dueDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortField) {
      case "title":
        return a.title.localeCompare(b.title) * direction
      case "status":
        return a.status.localeCompare(b.status) * direction
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction
      case "dueDate":
        if (!a.dueDate) return direction
        if (!b.dueDate) return -direction
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction
      case "assigneeId":
        if (!a.assigneeId) return direction
        if (!b.assigneeId) return -direction
        return a.assigneeId.localeCompare(b.assigneeId) * direction
      default:
        return 0
    }
  })

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No tasks found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button variant="ghost" className="flex items-center p-0 font-medium" onClick={() => handleSort("title")}>
                Title {renderSortIcon("title")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="flex items-center p-0 font-medium"
                onClick={() => handleSort("status")}
              >
                Status {renderSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="flex items-center p-0 font-medium"
                onClick={() => handleSort("priority")}
              >
                Priority {renderSortIcon("priority")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="flex items-center p-0 font-medium"
                onClick={() => handleSort("assigneeId")}
              >
                Assignee {renderSortIcon("assigneeId")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="flex items-center p-0 font-medium"
                onClick={() => handleSort("dueDate")}
              >
                Due Date {renderSortIcon("dueDate")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => {
            const assignee = task.assigneeId ? getUserById(task.assigneeId) : null

            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <Link href={`/tasks/${task.id}`} className="hover:underline">
                    {task.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    format(new Date(task.dueDate), "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
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
