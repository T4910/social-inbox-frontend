"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TasksKanban } from "@/components/tasks/tasks-kanban";
import { TasksTable } from "@/components/tasks/tasks-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionCheck } from "@/components/ui/permission-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTask } from "@/hooks/use-task";
import { type User } from "@/lib/types";
import { Filter, PlusCircle } from "lucide-react";
import { useState } from "react";

export function TasksView({ user }: { user: User }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const { tasks: allTasks } = useTask();

  // Apply filters
  const filteredTasks = allTasks?.filter((task) => {
    if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
      return false;
    }
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      return false;
    }
    return true;
  });

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
                    checked={statusFilter.includes("TODO")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "TODO"]);
                      } else {
                        setStatusFilter(
                          statusFilter.filter((s) => s !== "TODO")
                        );
                      }
                    }}
                  >
                    To Do
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("IN_PROGRESS")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "IN_PROGRESS"]);
                      } else {
                        setStatusFilter(
                          statusFilter.filter((s) => s !== "IN_PROGRESS")
                        );
                      }
                    }}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("REVIEW")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "REVIEW"]);
                      } else {
                        setStatusFilter(
                          statusFilter.filter((s) => s !== "REVIEW")
                        );
                      }
                    }}
                  >
                    In Review
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("DONE")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "DONE"]);
                      } else {
                        setStatusFilter(
                          statusFilter.filter((s) => s !== "DONE")
                        );
                      }
                    }}
                  >
                    Done
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuLabel className="mt-2">
                    Priority
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("HIGH")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "HIGH"]);
                      } else {
                        setPriorityFilter(
                          priorityFilter.filter((p) => p !== "HIGH")
                        );
                      }
                    }}
                  >
                    High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("MEDIUM")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "MEDIUM"]);
                      } else {
                        setPriorityFilter(
                          priorityFilter.filter((p) => p !== "MEDIUM")
                        );
                      }
                    }}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priorityFilter.includes("LOW")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, "LOW"]);
                      } else {
                        setPriorityFilter(
                          priorityFilter.filter((p) => p !== "LOW")
                        );
                      }
                    }}
                  >
                    Low
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <PermissionCheck actions={["create"]} resources={["tasks"]}>
                <Button onClick={() => setIsCreateTaskOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </PermissionCheck>
            </div>
          </div>

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              {filteredTasks && <TasksTable tasks={filteredTasks} />}
            </TabsContent>

            <TabsContent value="kanban">
              {filteredTasks && <TasksKanban tasks={filteredTasks} />}
            </TabsContent>
          </Tabs>
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
