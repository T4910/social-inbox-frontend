"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type User, tasks, projects, getTasksByAssigneeId, getProjectsByMemberId } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TaskSummary } from "@/components/dashboard/task-summary"
import { TaskList } from "@/components/tasks/task-list"
import { ProjectList } from "@/components/dashboard/project-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

export function DashboardView({ user }: { user: User }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const { data: userTasks } = useQuery({
    queryKey: ["tasks", user.id],
    queryFn: () => getTasksByAssigneeId(user.id),
    initialData: tasks.filter((task) => task.assigneeId === user.id),
  })

  const { data: userProjects } = useQuery({
    queryKey: ["projects", user.id],
    queryFn: () => getProjectsByMemberId(user.id),
    initialData: projects.filter((project) => project.members.includes(user.id)),
  })

  const todoTasks = userTasks.filter((task) => task.status === "todo")
  const inProgressTasks = userTasks.filter((task) => task.status === "in-progress")
  const reviewTasks = userTasks.filter((task) => task.status === "review")
  const completedTasks = userTasks.filter((task) => task.status === "done")

  const highPriorityTasks = userTasks.filter((task) => task.priority === "high" && task.status !== "done")

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader user={user} />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Button onClick={() => setIsCreateTaskOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TaskSummary title="To Do" count={todoTasks.length} />
            <TaskSummary title="In Progress" count={inProgressTasks.length} />
            <TaskSummary title="In Review" count={reviewTasks.length} />
            <TaskSummary title="Completed" count={completedTasks.length} />
          </div>

          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>High Priority Tasks</CardTitle>
                  <CardDescription>Tasks that need your immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={highPriorityTasks} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>All tasks assigned to you</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={userTasks} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>Projects you are a member of</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectList projects={userProjects} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} userId={user.id} />
    </div>
  )
}
