"use client";

import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-[var(--color-sketch-line)] bg-white/85 backdrop-blur-xl dark:bg-slate-950/82">
      <div className="sketch-shell flex h-[74px] items-center justify-between gap-5">
        <Link
          aria-label="Tandaan.AI home"
          className="relative inline-flex items-center"
          href="/"
        >
          <BrandWordmark />
          <span className="absolute -bottom-2 left-0 h-px w-full -rotate-2 bg-[var(--color-sketch-ink)]" />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-9 lg:flex"
        >
          {publicNavItems.map((item) => {
            const isActive = isActiveNavItem(pathname, item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-1 text-[13px] font-semibold transition ${
                  isActive
                    ? "text-[var(--color-sketch-ink)] underline decoration-[var(--color-sketch-ink)] decoration-2 underline-offset-10"
                    : "text-[var(--color-sketch-muted)] hover:text-[var(--color-sketch-ink)]"
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
              className="sketch-primary-button hidden h-10 px-5 text-[13px] md:inline-flex"
            >
              <Link href="/documents">Open Workspace</Link>
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
                className="hidden h-10 px-4 text-[13px] text-[var(--color-sketch-ink)] hover:bg-[var(--color-sketch-soft)] md:inline-flex"
                variant="ghost"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button
                asChild
                className="sketch-primary-button hidden h-10 px-5 text-[13px] md:inline-flex"
              >
                <Link href="/billing">Get Started Free</Link>
              </Button>
            </>
          ) : null}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation"
                className="size-10 rounded-lg border border-[var(--color-sketch-line)] bg-white p-0 text-[var(--color-sketch-ink)] lg:hidden dark:bg-slate-900"
                variant="outline"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(23rem,100vw)] border-[var(--color-sketch-line)] bg-white p-0 dark:bg-slate-950"
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
                      className="rounded-lg border border-[var(--color-sketch-line)] px-4 py-3 text-base font-bold text-[var(--color-sketch-ink)]"
                      href={item.href}
                      key={item.label}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  <Button asChild className="sketch-primary-button h-11">
                    <Link href="/billing">Get Started Free</Link>
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
