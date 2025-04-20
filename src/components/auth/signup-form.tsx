"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { register } from "@/lib/auth";
import {
  acceptInvite,
  createOrganization,
  validateInviteForRegister,
} from "@/lib/org";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
});

const orgFormSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
  invites: z.string().optional(), // comma-separated emails
});

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [invite, setInvite] = useState(false);
  const orgForm = useForm<z.infer<typeof orgFormSchema>>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: { name: "", invites: "" },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const orgInvite = searchParams.get("invite");

  useEffect(() => {
    async function validateInvite() {
      if (!!orgInvite) {
        try {
          const data = await validateInviteForRegister(orgInvite);

          if (data.status === 200) {
            setInvite(true);
            form.setValue("email", data.data!.email);
          } else {
            setError(data.message || "Invalid or expired invite.");
          }
        } catch {
          setError("Invalid or expired invite.");
        }
      }
    }

    validateInvite();
  }, [form, orgInvite]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await register(
        values.email,
        values.password,
        values.confirmPassword
      );

      if (data?.status === 200) {
        if (invite && orgInvite) {
          const result = await acceptInvite(orgInvite);

          if (result.status === 200) {
            router.push("/dashboard");
            router.refresh();
            return;
          } else {
            setError(result.message || "Failed to accept invite.");
            setIsLoading(false);
            return;
          }
        }

        router.push(`?u=${data?.data?.userId}`);
        setShowOrgDialog(true);
      } else {
        setError(data?.message || "An error occurred. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError(`An error occurred. Please try again. ${error}`);
      setIsLoading(false);
    }
  }

  async function onOrgSubmit(values: z.infer<typeof orgFormSchema>) {
    setOrgLoading(true);
    setOrgError(null);
    try {
      const userId = searchParams.get("u");

      if (!userId) {
        setOrgError("User ID is required.");
        router.push("/signup");
        return;
      }

      const data = await createOrganization(
        userId,
        values.name.trim(),
        values.invites !== ""
          ? values.invites?.split(",").map((email) => email.trim())
          : null
      );

      if (data?.status === 200) {
        setShowOrgDialog(false);
        router.push("/dashboard");
        router.refresh();
      } else {
        setOrgError(data.message || "Failed to create organization.");
      }
    } catch (e) {
      setOrgError("Failed to create organization.");
      console.log(e);
    } finally {
      setOrgLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-400 to-orange-600" />
            <CardTitle className="text-2xl">TaskFlow</CardTitle>
          </div>
          <CardDescription>Create a new Account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        readOnly={invite}
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
              {/* <Button
                asChild
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 mt-2"
              >
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_BACKEND_URL ||
                    "http://localhost:8787"
                  }/api/auth/google`}
                >
                  <img
                    src="/google-icon.svg"
                    alt="Google"
                    className="inline h-5 w-5 mr-2 align-middle"
                  />
                  Sign up with Google
                </a>
              </Button> */}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground">
          <p className="mt-4">
            Have an account?{" "}
            <Link className=" text-orange-400 underline" href="/login">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <Dialog open={showOrgDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-orange-500">
              Create your organization
            </DialogTitle>
          </DialogHeader>
          <Form {...orgForm}>
            <form
              onSubmit={orgForm.handleSubmit(onOrgSubmit)}
              className="space-y-4"
            >
              <FormField
                control={orgForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {orgLoading ? "Creating..." : "Create Organization"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
