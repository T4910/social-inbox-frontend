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
// import { useAuth } from "@/hooks/use-auth";
// import { useRoles } from "@/hooks/use-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const orgFormSchema = z.object({
  invites: z.string(), // comma-separated emails
});

export function InviteUserDialog({
  open,
  onOpenChange,
  //   user,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  //   user: {
  //     id: string;
  //     email: string;
  //     memberships?: {
  //       role: string;
  //       organizationId: string;
  //       isCurrent: boolean;
  //     }[];
  //   };
  onSubmit: (data: { invites: string }) => void;
}) {
  const orgForm = useForm({
    resolver: zodResolver(orgFormSchema),
    // defaultValues: { email: user.email, roleId: currentRoleId },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { invites: string }) => {
    setLoading(true);
    onSubmit(values);
    orgForm.reset();
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-orange-500">Invite User</DialogTitle>
        </DialogHeader>
        <Form {...orgForm}>
          <form
            onSubmit={orgForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={orgForm.control}
              name="invites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Invite team members (comma separated emails)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user1@example.com, user2@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {orgError && (
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertDescription>{orgError}</AlertDescription>
                 </Alert>
               )} */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Inviting..." : "Invite Users"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 *     
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="text-orange-500">
               Invite User
             </DialogTitle>
           </DialogHeader>
           <Form {...orgForm}>
             <form
               onSubmit={orgForm.handleSubmit(onSubmit)}
               className="space-y-4"
             >
               <FormField
                 control={orgForm.control}
                 name="invites"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>
                       Invite team members (comma separated emails)
                     </FormLabel>
                     <FormControl>
                       <Input
                         placeholder="user1@example.com, user2@example.com"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               {orgError && (
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertDescription>{orgError}</AlertDescription>
                 </Alert>
               )}
               <Button
                 type="submit"
                 className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                 disabled={orgLoading}
               >
                 {orgLoading ? "Inviting..." : "Invite Users"}
               </Button>
             </form>
           </Form>
         </DialogContent>
 */
