"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Header from "./header";
import Sidebar from "./sidebar";

function isMarketingRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/replay/")
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = isMarketingRoute(pathname);

  return (
    <>
      <Header />
      {isMarketing ? (
        <main className="min-h-[calc(100vh-50px)] bg-[radial-gradient(ellipse_at_10%_0%,oklch(0.68_0.19_25/0.07),transparent_40%),radial-gradient(ellipse_at_90%_20%,oklch(0.55_0.2_260/0.06),transparent_35%),linear-gradient(180deg,#f9faf9_0%,#f1f4f2_100%)]">
          {children}
        </main>
      ) : (
        <div className="flex h-[calc(100vh-50px)] overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#fbfbfa]">
            {children}
          </main>
        </div>
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "rounded-2xl border-[#ebe9e6] shadow-lg text-sm",
          },
        }}
      />
    </>
  );
}
