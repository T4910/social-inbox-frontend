"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserById, useUsers } from "@/hooks/use-users";
import { type Task } from "@/lib/types";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TasksTableProps {
  tasks: Task[];
}

type SortField = "title" | "status" | "priority" | "dueDate" | "assigneeId";
type SortDirection = "asc" | "desc";

export function TasksTable({ tasks }: TasksTableProps) {
  // const { user } = getUserById();
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "title":
        return a.title.localeCompare(b.title) * direction;
      case "status":
        return a.status.localeCompare(b.status) * direction;
      case "priority":
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (
          (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction
        );
      case "dueDate":
        if (!a.dueDate) return direction;
        if (!b.dueDate) return -direction;
        return (
          (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) *
          direction
        );
      case "assigneeId":
        if (!a.assigneeId) return direction;
        if (!b.assigneeId) return -direction;
        return a.assigneeId.localeCompare(b.assigneeId) * direction;
      default:
        return 0;
    }
  });

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No tasks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                className="flex items-center p-0 font-medium"
                onClick={() => handleSort("title")}
              >
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
            const assignee = task.assigneeId
              ? getUserById(task.assigneeId).user
              : null;

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
                        <AvatarImage
                          src={"assignee.avatar"}
                          alt={assignee.email}
                        />
                        <AvatarFallback>
                          {assignee.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{assignee.email}</span>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline">To Do</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="secondary">In Progress</Badge>;
    case "REVIEW":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        >
          In Review
        </Badge>
      );
    case "DONE":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        >
          Done
        </Badge>
      );
    default:
      return null;
  }
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  switch (priority) {
    case "HIGH":
      return <Badge variant="destructive">High</Badge>;
    case "MEDIUM":
      return (
        <Badge
          variant="outline"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
        >
          Medium
        </Badge>
      );
    case "LOW":
      return <Badge variant="outline">Low</Badge>;
    default:
      return null;
  }
}
