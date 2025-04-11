import { type Project, getUserById } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No projects found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const owner = getUserById(project.ownerId)

        return (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Owner:</span>
                {owner && (
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={owner.avatar} alt={owner.name} />
                      <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{owner.name}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Created:</span>
                <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Members:</span>
                <Badge variant="outline">{project.members.length}</Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
