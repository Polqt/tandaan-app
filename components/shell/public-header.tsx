"use client";

import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, PenBox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavItems } from "@/lib/marketing/site-content";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

const navItems = [...publicNavItems, { href: "/docs", label: "Docs" }];

function isActiveNavItem(pathname: string, href: string) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/billing" && pathname === "/pricing")
  );
}

export default function PublicHeader() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <header className="relative z-40 border-b border-[rgba(39,43,38,0.08)] bg-[rgba(247,237,219,0.72)] backdrop-blur-md">
      <div className="public-shell flex h-[76px] items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <Link
            aria-label="Tandaan home"
            className="group flex items-center gap-2"
            href="/"
          >
            <PenBox className="size-[15px] text-(--color-es-soft-ink)" />
            <p className="font-hand text-[1.55rem] font-semibold leading-none text-(--color-paper-ink)">
              Tandaan
            </p>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {navItems.map((item) => {
              const isActive = isActiveNavItem(pathname, item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`text-[13px] font-bold transition ${
                    isActive
                      ? "text-(--color-paper-ink) underline decoration-paper-red decoration-2 underline-offset-8"
                      : "text-(--color-paper-muted) hover:text-(--color-paper-ink)"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation"
                className="paper-link-button h-10 w-10 p-0 md:hidden"
                variant="ghost"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(22rem,100vw)] border-(--color-paper-line) bg-paper-sheet p-0"
              side="right"
            >
              <SheetTitle className="sr-only">Public navigation</SheetTitle>
              <div className="flex h-full flex-col p-5">
                <Link
                  className="font-hand text-4xl font-semibold text-(--color-paper-ink)"
                  href="/"
                >
                  Tandaan
                </Link>
                <nav className="mt-8 flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      className="border-b border-(--color-paper-line) py-3 text-lg font-bold text-(--color-paper-ink)"
                      href={item.href}
                      key={item.label}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  <Button asChild className="paper-button h-11">
                    <Link href="/documents">Start writing</Link>
                  </Button>
                  {!userId ? (
                    <Button
                      asChild
                      className="paper-link-button h-11"
                      variant="ghost"
                    >
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <SignedIn>
            <Button
              asChild
              className="paper-button hidden h-10 px-5 text-[13px] md:inline-flex"
            >
              <Link href="/documents">Open workspace</Link>
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
                className="paper-link-button hidden h-9 px-2 text-[13px] md:inline-flex"
                variant="ghost"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                asChild
                className="paper-button hidden h-10 px-6 text-[13px] md:inline-flex"
              >
                <Link href="/billing">Get started</Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
