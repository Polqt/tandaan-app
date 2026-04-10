"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

function isMarketingRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/replay/")
  );
}

export default function Header() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const isMarketing = isMarketingRoute(pathname);
  const isDocsRoute = pathname.startsWith("/docs");
  const isBlogRoute = pathname.startsWith("/blog");
  const isPricingRoute = pathname === "/pricing";

  // Marketing / public header
  if (isMarketing) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/40 bg-[#f8faf9]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <div className="flex items-center gap-8">
            <Link className="group flex items-center gap-2" href="/" aria-label="Tandaan home">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white text-xs font-bold">
                T
              </div>
              <div>
                <p className="font-display text-[15px] font-bold tracking-tight text-slate-950 leading-none">
                  Tandaan
                </p>
              </div>
            </Link>

            <nav
              className="hidden items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/70 p-1 backdrop-blur-sm md:flex"
              aria-label="Main navigation"
            >
              {[
                { label: "Product", href: "/", active: pathname === "/" },
                { label: "Pricing", href: "/pricing", active: isPricingRoute },
                { label: "Docs", href: "/docs", active: isDocsRoute },
                { label: "Blog", href: "/blog", active: isBlogRoute },
              ].map((item) => (
                <Link
                  key={item.label}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                    item.active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                  }`}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {userId ? (
              <>
                <Button asChild className="h-8 rounded-full px-4 text-[13px] font-semibold">
                  <Link href="/documents">Open Workspace</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-7 h-7" } }}
                />
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 rounded-full px-3 text-[13px] font-medium text-slate-600"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild className="h-8 rounded-full px-4 text-[13px] font-semibold">
                  <Link href="/pricing">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  // In-app header (shown above the sidebar+content layout for documents/*)
  return (
    <header className="flex h-[50px] items-center justify-between border-b border-[#ebe9e6] bg-[#fbfbfa] px-4">
      <Link
        href="/documents"
        className="flex items-center gap-2 text-sm font-semibold text-stone-700 transition-colors hover:text-stone-950"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-white text-xs font-bold">
          T
        </div>
        Tandaan
      </Link>

      <div className="flex items-center gap-2">
        <SignedOut>
          <Button asChild variant="outline" className="h-7 rounded-full px-3 text-xs">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-6 h-6" } }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
