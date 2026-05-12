"use client";

import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  afterSignInUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SignInButton({
  children,
  afterSignInUrl = "/documents",
  className,
}: SignInButtonProps) {
  return (
    <ClerkSignInButton
      fallbackRedirectUrl={afterSignInUrl}
      forceRedirectUrl={afterSignInUrl}
    >
      <Button className={className}>
        {children || "Sign in"}
      </Button>
    </ClerkSignInButton>
  );
}