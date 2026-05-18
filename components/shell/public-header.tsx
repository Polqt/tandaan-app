"use client";

import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "@/components/marketing/shared/sketch-primitives";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicNavItems } from "@/lib/marketing/site-content";

function isActiveNavItem(pathname: string, href: string) {
  if (href === "/pricing") {
    return pathname === "/pricing" || pathname === "/billing";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicHeader() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-transparent px-4 py-4">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-5 rounded-full border border-slate-200 bg-white/92 px-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <Link
          aria-label="Tandaan.AI home"
          className="group relative inline-flex items-center"
          href="/"
        >
          <BrandWordmark className="text-[1.45rem] text-[#1e1e22]" />
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#1e1e22] transition-all duration-200 group-hover:w-full" />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {publicNavItems.map((item) => {
            const isActive = isActiveNavItem(pathname, item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full px-4 text-[15px] font-bold transition ${
                  isActive
                    ? "bg-[#101116] text-white"
                    : "text-[#1e1e22] hover:bg-slate-100"
                }`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SignedIn>
            <Button
              asChild
              className="hidden h-10 rounded-full bg-[#101116] px-5 text-[13px] font-extrabold text-white hover:bg-[#24252c] md:inline-flex"
            >
              <Link href="/documents">
                Open Workspace
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "w-7 h-7" } }}
            />
          </SignedIn>

          {!userId ? (
            <>
              <Button
                asChild
                className="hidden h-10 rounded-full px-4 text-[15px] font-bold text-[#1e1e22] hover:bg-slate-100 md:inline-flex"
                variant="ghost"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button
                asChild
                className="hidden h-10 rounded-full bg-[#101116] px-5 text-[15px] font-extrabold text-white hover:bg-[#24252c] md:inline-flex"
              >
                <Link href="/sign-in">Get Started Free</Link>
              </Button>
            </>
          ) : null}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation"
                className="size-10 rounded-full border border-slate-200 bg-white p-0 text-[#1e1e22] lg:hidden"
                variant="outline"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(23rem,100vw)] border-(--color-sketch-line) bg-white p-0 dark:bg-slate-950"
              side="right"
            >
              <SheetTitle className="sr-only">Public navigation</SheetTitle>
              <div className="flex h-full flex-col p-5">
                <Link href="/" aria-label="Tandaan.AI home">
                  <BrandWordmark className="text-[2.2rem]" />
                </Link>
                <nav className="mt-8 flex flex-col gap-2">
                  {publicNavItems.map((item) => (
                    <Link
                      className="rounded-lg border border-(--color-sketch-line) px-4 py-3 text-base font-bold text-[var(--color-sketch-ink)]"
                      href={item.href}
                      key={item.label}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  <Button asChild className="sketch-primary-button h-11">
                    <Link href="/sign-in">Get Started Free</Link>
                  </Button>
                  {!userId ? (
                    <Button asChild className="h-11" variant="outline">
                      <Link href="/sign-in">Log in</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
