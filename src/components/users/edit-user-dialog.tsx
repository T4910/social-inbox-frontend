import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editUserSchema = z.object({
  email: z.string().email(),
  roleId: z.string(),
});

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    email: string;
    memberships?: {
      role: string;
      organizationId: string;
      isCurrent: boolean;
    }[];
  };
  onSubmit: (data: { email: string; roleId: string }) => void;
}) {
  const { roles } = useRoles();
  const { user: currentUser } = useAuth();

  const currentRoleId = currentUser?.orgRole?.id || ""; // not working
  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: { email: user.email, roleId: currentRoleId },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; roleId: string }) => {
    setLoading(true);
    onSubmit(values);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map(
                        (role) =>
                          role.id !== currentRoleId && (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
