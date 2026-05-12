"use client";

import { useSignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function CustomSignUpPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/documents";
  
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { isLoaded: signInLoaded } = useSignUp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoaded = signUpLoaded && signInLoaded;

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || !isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      if (result.status === "complete") {
        window.location.href = callbackUrl;
      } else if (result.status === "missing_requirements") {
        setIsSubmitted(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: "google" | "github") => {
    if (!signUp || !isLoaded) return;
    
    signUp.authenticateWithRedirect({
      redirectUrl: callbackUrl,
      redirectUrlComplete: callbackUrl,
      strategy: provider === "google" ? "oauth_google" : "oauth_github",
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-es-primary border-t-transparent" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Success">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-es-ink">Check your email</h2>
          <p className="mt-2 text-sm text-es-muted">
            We sent a verification link to <span className="font-medium text-es-ink">{email}</span>.
            Click the link to activate your account.
          </p>
          <Button
            className="mt-6"
            onClick={() => { window.location.href = "/sign-in"; }}
            variant="outline"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-es-ink">Tandaan</h1>
          <p className="mt-1 text-sm text-es-muted">
            Create your account to get started.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={() => handleOAuthSignUp("google")}
            variant="outline"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-label="Google">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            className="w-full"
            disabled={isLoading}
            onClick={() => handleOAuthSignUp("github")}
            variant="outline"
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-label="GitHub">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e7e2d7]" />
          <span className="text-xs text-es-muted">or</span>
          <div className="h-px flex-1 bg-[#e7e2d7]" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignUp}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="firstName">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="lastName">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-[10px] text-es-muted">
                Must be at least 8 characters
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-es-muted">
          By continuing, you agree to our{" "}
          <a className="underline hover:text-es-primary" href="/terms">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline hover:text-es-primary" href="/privacy">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}