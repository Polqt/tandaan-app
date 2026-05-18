import ClientAuthGuard from "@/components/auth/client-auth-guard";
import ProtectedShell from "@/components/shell/protected-shell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <ProtectedShell>{children}</ProtectedShell>
    </ClientAuthGuard>
  );
}
