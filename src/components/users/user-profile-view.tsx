"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type User } from "@/lib/types";
import { getUserById, updateUser } from "@/lib/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
});

export function UserProfileView({
  userId,
  currentUser,
}: {
  userId: string;
  currentUser: User;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const isSelf = userId === currentUser.id;

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user?.email || "", password: "" },
    values: { email: user?.email || "", password: "" },
  });

  const canEdit =
    user &&
    (userId === currentUser.id ||
      currentUser.memberships.some((m) => m.role === "administrator"));

  useEffect(() => {
    async function fetchUser() {
      try {
        const orgId = currentUser.memberships.find(
          (m) => m.isCurrent
        )?.organizationId;
        if (!orgId) {
          setUser(null);
          setLoading(false);
          return;
        }
        const u = await getUserById(userId, orgId);
        setUser(u);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId, currentUser]);

  const handleSave = async (values: { email: string; password?: string }) => {
    setSaving(true);
    const orgId = currentUser.memberships.find(
      (m) => m.isCurrent
    )?.organizationId;
    if (!orgId) {
      setSaving(false);
      return;
    }
    const updateData: { email: string; password?: string } = {
      email: values.email,
    };
    if (values.password) {
      updateData.password = values.password;
    }
    await updateUser(userId, updateData, orgId);
    setSaving(false);
    setEditMode(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">User not found.</div>;

  return (
    <div className="flex flex-col items-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{isSelf ? "Your Profile" : user.email}</CardTitle>
          <CardDescription>
            User details and organization memberships
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              <div className="mb-4">
                <div className="font-semibold">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold">Organization Memberships:</div>
                <ul className="list-disc ml-6">
                  {user.memberships?.map((m) => (
                    <li key={m.organizationId}>
                      <span className="font-medium">{m.organizationName}</span>{" "}
                      – <Badge>{m.role}</Badge>
                      {m.isCurrent && (
                        <span className="ml-2 text-xs text-orange-500">
                          (Current)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {canEdit && (
                <Button onClick={() => setEditMode(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
