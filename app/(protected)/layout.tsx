import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProtectedShell from "@/components/shell/protected-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ProtectedShell>{children}</ProtectedShell>;
}
