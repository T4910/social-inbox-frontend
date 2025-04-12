"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserById, useUsers } from "@/hooks/use-users";
import { type Task } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

interface TasksKanbanProps {
  tasks: Task[];
}

export function TasksKanban({ tasks }: TasksKanbanProps) {
  const todoTasks = tasks.filter((task) => task.status === "PENDING");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const reviewTasks = tasks.filter((task) => task.status === "REVIEW");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KanbanColumn title="To Do" tasks={todoTasks} />
      <KanbanColumn title="In Progress" tasks={inProgressTasks} />
      <KanbanColumn title="In Review" tasks={reviewTasks} />
      <KanbanColumn title="Done" tasks={doneTasks} />
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}

function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <div className="flex flex-col gap-2 rounded-md border bg-muted/40 p-2 min-h-[500px]">
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const assignee = task.assigneeId ? getUserById(task.assigneeId).user : null;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-3 pb-0">
        <Link href={`/tasks/${task.id}`}>
          <CardTitle className="text-sm hover:underline">
            {task.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <CardDescription className="line-clamp-2 text-xs">
          {task.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-col items-start gap-2">
        <div className="flex items-center gap-1">
          {task.priority === "HIGH" && (
            <Badge variant="destructive">High</Badge>
          )}
          {task.priority === "MEDIUM" && (
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
            >
              Medium
            </Badge>
          )}
          {task.priority === "LOW" && <Badge variant="outline">Low</Badge>}
        </div>

        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {assignee ? (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={"assignee.avatar"} alt={assignee.email} />
                  <AvatarFallback>{assignee.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{assignee.email}</span>
              </>
            ) : (
              <span>Unassigned</span>
            )}
          </div>

          {task.dueDate && (
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
