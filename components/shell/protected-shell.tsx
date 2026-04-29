import Sidebar from "../navigation/sidebar";

export default function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f6f2]">
      <div className="h-full shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto bg-[#f7f6f2]">{children}</main>
    </div>
  );
}
