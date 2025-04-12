import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/use-users";
import { type Task } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  // Get all users at the component level
  const { users: allUsers } = useUsers();

  // Create a memoized map of assignees for performance
  const assigneeMap = useMemo(() => {
    if (!allUsers) return new Map();
    return new Map(allUsers.map((user) => [user.id, user]));
  }, [allUsers]);

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
    <div className="space-y-2">
      {tasks.map((task) => {
        const assignee = task.assigneeId
          ? assigneeMap.get(task.assigneeId)
          : null;

        return (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
          >
            <div className="grid gap-1">
              <Link
                href={`/tasks/${task.id}`}
                className="font-medium hover:underline"
              >
                {task.title}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.dueDate && (
                  <span>
                    Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
            {assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={"assignee.avatar"} alt={assignee.email} />
                  <AvatarFallback>{assignee.email.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        );
      })}
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
