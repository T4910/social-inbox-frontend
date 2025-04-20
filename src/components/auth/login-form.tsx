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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await login(values.email, values.password);

      if (res?.status === 200) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res?.message || "An error occurred. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError(`An error occurred. Please try again. ${error}`);
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-400 to-orange-600" />
          <CardTitle className="text-2xl">TaskFlow</CardTitle>
        </div>
        <CardDescription>Sign in to your account to continue</CardDescription>
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
                    <Input placeholder="email@example.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            {/* <Button
              asChild
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 mt-2"
            >
              <a
                href={`${
                  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787"
                }/api/auth/google`}
              >
                <img
                  src="/google-icon.svg"
                  alt="Google"
                  className="inline h-5 w-5 mr-2 align-middle"
                />
                Sign in with Google
              </a>
            </Button> */}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm text-muted-foreground">
        Demo Account:
        <p>{"(email: ttaiwo4910@gmail.com, password: a)"}</p>
        <p className="mt-4">
          Don{"'"}t have an account?{" "}
          <Link className=" text-orange-400 underline" href="/signup">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
