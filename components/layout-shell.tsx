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

function isAppRoute(pathname: string) {
  return pathname.startsWith("/documents") || pathname.startsWith("/billing");
}

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMarketing = isMarketingRoute(pathname);
  const isApp = isAppRoute(pathname);

  return (
    <>
      {!isApp && <Header />}
      {isMarketing ? (
        <main className="min-h-[calc(100vh-50px)] bg-[linear-gradient(180deg,#fbfaf7_0%,#f6f3ed_54%,#fbfaf7_100%)]">
          {children}
        </main>
      ) : isApp ? (
        <div className="flex h-screen overflow-hidden bg-[#f7f6f2]">
          <div className="h-full shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto bg-[#f7f6f2]">
            {children}
          </main>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto bg-[#fbfbfa]">{children}</main>
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
