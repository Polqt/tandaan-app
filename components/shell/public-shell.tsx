import PublicHeader from "./public-header";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="min-h-[calc(100vh-76px)] bg-[linear-gradient(180deg,#f7eddb_0%,#fbf4e7_54%,#f5ead8_100%)]">
        {children}
      </main>
    </>
  );
}
