"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { TasksKanban } from "@/components/tasks/tasks-kanban"
import { TasksTable } from "@/components/tasks/tasks-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type User, tasks } from "@/lib/data"
import { useQuery } from "@tanstack/react-query"
import { Filter, PlusCircle } from "lucide-react"
import { useState } from "react"

export function TasksView({ user }: { user: User }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])

  const { data: allTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasks,
    initialData: tasks,
  })

  // Apply filters
  const filteredTasks = allTasks.filter((task) => {
    if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
      return false
    }
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      return false
    }
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("todo")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "todo"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "todo"))
                      }
                    }}
                  >
                    To Do
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("in-progress")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "in-progress"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "in-progress"))
                      }
                    }}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("review")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "review"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "review"))
                      }
                    }}
                  >
                    In Review
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("done")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "done"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "done"))
                      }
                    }}
                  >
                    Done
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuLabel className="mt-2">Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("high")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "high"])
                      } else {
                        setPriorityFilter(priorityFilter.filter((p) => p !== "high"))
                      }
                    }}
                  >
                    High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("medium")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "medium"])
                      } else {
                        setPriorityFilter(priorityFilter.filter((p) => p !== "medium"))
                      }
                    }}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("low")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "low"])
                      } else {
                        setPriorityFilter(priorityFilter.filter((p) => p !== "low"))
                      }
                    }}
                  >
                    Low
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setIsCreateTaskOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <TasksTable tasks={filteredTasks} />
            </TabsContent>

            <TabsContent value="kanban">
              <TasksKanban tasks={filteredTasks} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} userId={user.id} />
    </div>
  )
}
