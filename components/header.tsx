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
    pathname === "/" || pathname === "/docs" || pathname.startsWith("/replay/")
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const { userId } = useAuth();
  const isProductExperience = isProductRoute(pathname);

  if (isProductExperience) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f7fbfa]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-3" href="/">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-slate-950">
                  Tandaan
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Collaborative Replay Notes
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 md:flex">
              <Link
                className={`rounded-full px-4 py-2 text-sm transition ${
                  pathname === "/"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                href="/"
              >
                Product
              </Link>
              <Link
                className={`rounded-full px-4 py-2 text-sm transition ${
                  pathname === "/docs"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                href="/docs"
              >
                Docs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {userId ? (
              <>
                <Button asChild>
                  <Link href="/documents">Open Workspace</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                />
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/docs">See How It Works</Link>
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
