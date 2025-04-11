"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { roles, type Role, type Permission } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"

export function RolesManagementView() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  })

  const { data: allRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => roles,
    initialData: roles,
  })

  const handleCreateRole = (role: Omit<Role, "id">) => {
    // In a real app, this would be an API call
    const newRole: Role = {
      id: `role-${roles.length + 1}`,
      ...role,
    }

    roles.push(newRole)
    queryClient.invalidateQueries({ queryKey: ["roles"] })

    toast({
      title: "Role created",
      description: `Role "${role.name}" has been created successfully.`,
    })

    setIsCreateDialogOpen(false)
  }

  const handleUpdateRole = (role: Role) => {
    // In a real app, this would be an API call
    const roleIndex = roles.findIndex((r) => r.id === role.id)
    if (roleIndex !== -1) {
      roles[roleIndex] = role
      queryClient.invalidateQueries({ queryKey: ["roles"] })

      toast({
        title: "Role updated",
        description: `Role "${role.name}" has been updated successfully.`,
      })

      setEditingRole(null)
    }
  }

  const handleDeleteRole = (roleId: string) => {
    // In a real app, this would be an API call
    const roleIndex = roles.findIndex((r) => r.id === roleId)
    if (roleIndex !== -1) {
      const roleName = roles[roleIndex].name
      roles.splice(roleIndex, 1)
      queryClient.invalidateQueries({ queryKey: ["roles"] })

      toast({
        title: "Role deleted",
        description: `Role "${roleName}" has been deleted successfully.`,
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader user={user!} />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Role
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage roles and permissions for users in your organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length > 0 ? (
                            <>
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {role.permissions.length} permissions
                              </span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">No permissions</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingRole(role)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the role.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateRoleDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateRole} />

      {editingRole && (
        <EditRoleDialog
          role={editingRole}
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          onSubmit={handleUpdateRole}
        />
      )}
    </div>
  )
}

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (role: Omit<Role, "id">) => void
}

function CreateRoleDialog({ open, onOpenChange, onSubmit }: CreateRoleDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name,
      description,
      permissions,
    })

    // Reset form
    setName("")
    setDescription("")
    setPermissions([])
  }

  const togglePermission = (resource: Permission["resource"], action: Permission["action"]) => {
    const exists = permissions.some((p) => p.resource === resource && p.action === action)

    if (exists) {
      setPermissions(permissions.filter((p) => !(p.resource === resource && p.action === action)))
    } else {
      setPermissions([...permissions, { resource, action }])
    }
  }

  const hasPermission = (resource: Permission["resource"], action: Permission["action"]) => {
    return permissions.some((p) => p.resource === resource && p.action === action)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Add a new role with specific permissions.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Project Manager"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's responsibilities"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-5 gap-2 mb-2 font-medium">
                  <div>Resource</div>
                  <div>Create</div>
                  <div>Read</div>
                  <div>Update</div>
                  <div>Delete</div>
                </div>

                <div className="space-y-4">
                  {["tasks", "projects", "users", "roles"].map((resource) => (
                    <div key={resource} className="grid grid-cols-5 gap-2 items-center">
                      <div className="capitalize">{resource}</div>
                      {["create", "read", "update", "delete"].map((action) => (
                        <div key={action}>
                          <Checkbox
                            checked={hasPermission(resource as Permission["resource"], action as Permission["action"])}
                            onCheckedChange={() =>
                              togglePermission(resource as Permission["resource"], action as Permission["action"])
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!name || !description}>
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface EditRoleDialogProps {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (role: Role) => void
}

function EditRoleDialog({ role, open, onOpenChange, onSubmit }: EditRoleDialogProps) {
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description)
  const [permissions, setPermissions] = useState<Permission[]>(role.permissions)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      id: role.id,
      name,
      description,
      permissions,
    })
  }

  const togglePermission = (resource: Permission["resource"], action: Permission["action"]) => {
    const exists = permissions.some((p) => p.resource === resource && p.action === action)

    if (exists) {
      setPermissions(permissions.filter((p) => !(p.resource === resource && p.action === action)))
    } else {
      setPermissions([...permissions, { resource, action }])
    }
  }

  const hasPermission = (resource: Permission["resource"], action: Permission["action"]) => {
    return permissions.some((p) => p.resource === resource && p.action === action)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update role details and permissions.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Project Manager"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's responsibilities"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-5 gap-2 mb-2 font-medium">
                  <div>Resource</div>
                  <div>Create</div>
                  <div>Read</div>
                  <div>Update</div>
                  <div>Delete</div>
                </div>

                <div className="space-y-4">
                  {["tasks", "projects", "users", "roles"].map((resource) => (
                    <div key={resource} className="grid grid-cols-5 gap-2 items-center">
                      <div className="capitalize">{resource}</div>
                      {["create", "read", "update", "delete"].map((action) => (
                        <div key={action}>
                          <Checkbox
                            checked={hasPermission(resource as Permission["resource"], action as Permission["action"])}
                            onCheckedChange={() =>
                              togglePermission(resource as Permission["resource"], action as Permission["action"])
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!name || !description}>
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
