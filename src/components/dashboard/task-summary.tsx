import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskSummaryProps {
  title: string
  count: number
}

export function TaskSummary({ title, count }: TaskSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{count === 1 ? "task" : "tasks"}</p>
      </CardContent>
    </Card>
  )
}
