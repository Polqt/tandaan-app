import PublicHeader from "./public-header";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="min-h-[calc(100vh-72px)] bg-[var(--color-sketch-page)]">
        {children}
      </main>
    </>
  );
}
