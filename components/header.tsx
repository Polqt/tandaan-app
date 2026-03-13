"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

function isProductRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/replay/")
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const { userId } = useAuth();
  const isProductExperience = isProductRoute(pathname);
  const isDocsRoute = pathname.startsWith("/docs");
  const isBlogRoute = pathname.startsWith("/blog");

  if (isProductExperience) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/40 bg-[#f8faf9]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-3 group" href="/">
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-slate-950 transition group-hover:text-coral">
                  Tandaan
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Collaborative Replay Notes
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1 backdrop-blur-sm md:flex">
              {[
                { label: "Product", href: "/", active: pathname === "/" },
                { label: "Docs", href: "/docs", active: isDocsRoute },
                { label: "Blog", href: "/blog", active: isBlogRoute },
              ].map((item) => (
                <Link
                  key={item.label}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {userId ? (
              <>
                <Button
                  asChild
                  className="h-9 rounded-full px-5 text-sm font-semibold"
                >
                  <Link href="/documents">Open Workspace</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                />
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="h-9 rounded-full px-4 text-sm font-medium text-slate-600"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="h-9 rounded-full px-5 text-sm font-semibold"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="flex items-center justify-between p-5 border-b border-gray-600">
      <h1 className="font-display text-2xl font-semibold">
        {userId && user?.firstName ? `${user.firstName}'s Notes` : "Tandaan"}
      </h1>

      <div className="flex items-center gap-2">
        <SignedOut>
          <Button asChild variant={"outline"}>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
