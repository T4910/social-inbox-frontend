"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TaskSummary } from "@/components/dashboard/task-summary";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionCheck } from "@/components/ui/permission-check";
import { useAssignedTask } from "@/hooks/use-task";
import { type User } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function DashboardView({ user }: { user: User }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const { tasks: userTasks } = useAssignedTask(user.id);

  const todoTasks = userTasks?.filter((task) => task.status === "PENDING");
  const inProgressTasks = userTasks?.filter(
    (task) => task.status === "IN_PROGRESS"
  );
  const reviewTasks = userTasks?.filter((task) => task.status === "REVIEW");
  const completedTasks = userTasks?.filter((task) => task.status === "DONE");

  const highPriorityTasks = userTasks?.filter(
    (task) => task.priority === "HIGH" && task.status !== "DONE"
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <PermissionCheck actions={["create"]} resources={["tasks"]}>
              <Button onClick={() => setIsCreateTaskOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </PermissionCheck>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TaskSummary title="To Do" count={todoTasks?.length || 0} />
            <TaskSummary
              title="In Progress"
              count={inProgressTasks?.length || 0}
            />
            <TaskSummary title="In Review" count={reviewTasks?.length || 0} />
            <TaskSummary
              title="Completed"
              count={completedTasks?.length || 0}
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>High Priority Tasks</CardTitle>
              <CardDescription>
                Tasks that need your immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={highPriorityTasks ?? []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>All tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={userTasks ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>

      <PermissionCheck actions={["create"]} resources={["tasks"]}>
        <CreateTaskDialog
          open={isCreateTaskOpen}
          onOpenChange={setIsCreateTaskOpen}
          userId={user.id}
        />
      </PermissionCheck>
    </div>
  );
}
