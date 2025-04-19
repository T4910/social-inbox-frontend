"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionCheck } from "@/components/ui/permission-check";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import { emailInvites } from "@/lib/org";
import { type User } from "@/lib/types";
import { Edit, PlusCircleIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InviteUserDialog } from "./invite-user-dialog";

export function UsersOverviewView() {
  const { user, currentOrgId } = useAuth();
  const { users, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Users Overview
            </h2>
            <PermissionCheck actions={["create"]} resources={["users"]}>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Invite Users
              </Button>
            </PermissionCheck>
          </div>
          {/* </div> */}

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <PermissionCheck
                      actions={["update", "delete"]}
                      resources={["users"]}
                    >
                      <TableHead>Actions</TableHead>
                    </PermissionCheck>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Link
                          href={`/users/${u.id}`}
                          className="text-orange-600 underline hover:text-orange-800"
                        >
                          {u.email}
                        </Link>
                      </TableCell>
                      <TableCell>{u.orgRole.name || "-"}</TableCell>
                      <PermissionCheck
                        actions={["update", "delete"]}
                        resources={["users"]}
                      >
                        <TableCell className="flex gap-2">
                          <PermissionCheck
                            actions={["update"]}
                            resources={["users"]}
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Edit user"
                              onClick={() => setEditingUser(u)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionCheck>
                          <PermissionCheck
                            actions={["delete"]}
                            resources={["users"]}
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Delete user"
                              onClick={() => setDeletingUser(u)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionCheck>
                        </TableCell>
                      </PermissionCheck>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <InviteUserDialog
            open={inviteDialogOpen}
            onOpenChange={setInviteDialogOpen}
            onSubmit={(data) => {
              setInviteDialogOpen(false);
              console.log(data);
              emailInvites(
                user!?.id,
                currentOrgId || "",
                data.invites.split(",").map((email) => email.trim())
              );
            }}
          />
          {editingUser && (
            <EditUserDialog
              open={!!editingUser}
              onOpenChange={(open) => !open && setEditingUser(null)}
              user={editingUser}
              onSubmit={(data) => updateUser({ ...editingUser, ...data })}
            />
          )}
          {deletingUser && (
            <AlertDialog
              open={!!deletingUser}
              onOpenChange={(open) => !open && setDeletingUser(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                </AlertDialogHeader>
                <div>Are you sure you want to delete {deletingUser.email}?</div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteUser(deletingUser.id);
                      setDeletingUser(null);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
