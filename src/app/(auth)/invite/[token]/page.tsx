// frontend/src/app/invite/[token]/page.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInvite, validateInvite } from "@/lib/org";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvitePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [canAccept, setCanAccept] = useState(false);

  useEffect(() => {
    const validate = async () => {
      setStatus("loading");
      try {
        const result = await validateInvite(token);
        if (result.ok) {
          setCanAccept(true);
        } else {
          setMessage(result.message || "Invalid or expired invite.");
        }
      } catch {
        setMessage("Invalid or expired invite.");
      } finally {
        setStatus("idle");
      }
    };

    validate();
  }, [token]);

  const handleAccept = async () => {
    setStatus("loading");
    const result = await acceptInvite(token);
    if (result.status === 200) {
      setStatus("success");
      setMessage("You have joined the organization! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 400);
    } else {
      if (result.status === 404 && result.message === "register-user-first") {
        setMessage("No user found for invite email. Please register first.");
        router.push(`/register?invite=${result.inviteId}`);
        return;
      }

      setStatus("error");
      setMessage(result.message || "Failed to accept invite.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-orange-500">
            Accept Organization Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              variant={status === "success" ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {canAccept && status !== "success" && (
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAccept}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Accepting..." : "Accept Invite"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
