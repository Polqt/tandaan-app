"use client";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { PenBox } from "lucide-react";
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

  if (isMarketing) {
    return (
      <header className="relative z-40 bg-transparent">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Link
              className="group flex items-center gap-2"
              href="/"
              aria-label="Tandaan home"
            >
              <PenBox className="size-[15px] text-[var(--color-es-soft-ink)]" />
              <p className="font-display text-[15px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-es-ink)] sm:text-[16px]">
                Tandaan
              </p>
            </Link>

            <nav
              className="hidden items-center gap-12 md:flex"
              aria-label="Main navigation"
            >
              {[
                { label: "Features", href: "/", active: pathname === "/" },
                {
                  label: "Templates",
                  href: "/pricing",
                  active: isPricingRoute,
                },
                { label: "Blog", href: "/blog", active: isBlogRoute },
                { label: "Docs", href: "/docs", active: isDocsRoute },
              ].map((item) => (
                <Link
                  key={item.label}
                  className={`text-[11px] font-semibold uppercase tracking-[0.24em] transition ${
                    item.active
                      ? "text-[var(--color-es-ink)]"
                      : "text-[var(--color-es-soft-ink)] hover:text-[var(--color-es-ink)]"
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
                <Button
                  asChild
                  className="h-10 rounded-[3px] border border-[var(--color-es-primary)] bg-[var(--color-es-primary)] px-5 text-[13px] font-semibold text-white hover:bg-[var(--color-es-ink)]"
                >
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
                  className="h-9 px-2 text-[13px] font-medium text-[var(--color-es-soft-ink)]"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="h-10 rounded-[3px] border border-[var(--color-es-primary)] bg-[var(--color-es-primary)] px-6 text-[13px] font-semibold text-white hover:bg-[var(--color-es-ink)]"
                >
                  <Link href="/pricing">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

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
          <Button
            asChild
            variant="outline"
            className="h-7 rounded-full px-3 text-xs"
          >
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
