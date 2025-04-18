import TokenInvite from "@/components/auth/token-invite";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;

  return <TokenInvite token={token} />;
}
