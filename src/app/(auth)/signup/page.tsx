export const dynamic = "force-dynamic";

import { SignupForm } from "@/components/auth/signup-form";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignupForm />
    </div>
  );
}
