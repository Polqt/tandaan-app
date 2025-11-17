"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import VersionHistory from "./documents/version-history";

export default function Header() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-5 border-b border-gray-600">
      {user && (
        <h1 className="text-2xl">
          {user?.firstName}
          {`'s`} Notes
        </h1>
      )}

      <div className="flex items-center gap-2">
        <VersionHistory />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant={"outline"}>Sign In</Button>
          </SignInButton>
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
