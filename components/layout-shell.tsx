"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Header from "./header";
import Sidebar from "./sidebar";

type LayoutShellProps = {
  children: React.ReactNode;
};

function isProductRoute(pathname: string) {
  return (
    pathname === "/" || pathname === "/docs" || pathname.startsWith("/replay/")
  );
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isProductExperience = isProductRoute(pathname);

  return (
    <>
      <Header />
      {isProductExperience ? (
        <main className="min-h-[calc(100vh-89px)] bg-[radial-gradient(circle_at_top,rgba(24,115,104,0.16),transparent_38%),linear-gradient(180deg,#f8fbfa_0%,#eef3f1_100%)]">
          {children}
        </main>
      ) : (
        <div className="flex min-h-[calc(100vh-89px)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-slate-100 p-4">
            {children}
          </main>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  );
}
