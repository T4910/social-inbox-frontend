import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-2xl ">
              Welcome to the demo application made by Emmanuel Taiwo
            </CardTitle>
          </div>
          <CardDescription>
            <Link href="/signup" className=" text-orange-400 underline">
              Sign up to continue
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          This project is a full-stack application built with Next.js, Prisma,
          Tailwind CSS and Hono.js, deployed on Vercel and Cloudflare. It is
          designed to help you manage your tasks efficiently. You can create,
          update, and delete tasks, as well as mark them as complete. The
          application also includes user authentication and authorization
          features. You can also visit the{" "}
          <Link href="/login" className=" text-orange-400 ">
            login page
          </Link>{" "}
          to use one of the demo accounts
        </CardContent>
      </Card>
    </div>
  );
}
