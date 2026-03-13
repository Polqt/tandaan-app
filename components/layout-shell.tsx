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
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/replay/")
  );
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isProductExperience = isProductRoute(pathname);

  return (
    <>
      <Header />
      {isProductExperience ? (
        <main className="min-h-[calc(100vh-65px)] bg-[radial-gradient(ellipse_at_10%_0%,oklch(0.68_0.19_25/0.08),transparent_40%),radial-gradient(ellipse_at_90%_20%,oklch(0.55_0.2_260/0.07),transparent_35%),linear-gradient(180deg,#f9faf9_0%,#f1f4f2_100%)]">
          {children}
        </main>
      ) : (
        <div className="flex min-h-[calc(100vh-65px)]">
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
