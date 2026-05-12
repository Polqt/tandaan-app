"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ShareInfo {
  documentId: string;
  expiresAt: string;
  id: string;
}

export default function SharedDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.shareId as string;

  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch share info on mount
  useEffect(() => {
    if (!shareId) {
      setError("Invalid share link");
      setIsLoading(false);
      return;
    }

    const fetchShareInfo = async () => {
      try {
        const response = await fetch(`/api/share/${shareId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("This share link is invalid or has expired");
          } else if (response.status === 401) {
            setShareInfo({
              documentId: "",
              expiresAt: "",
              id: shareId,
            });
          } else {
            setError("Failed to load shared document");
          }
          return;
        }

        const data = await response.json();
        if (data.share) {
          if (new Date(data.share.expiresAt) < new Date()) {
            setError("This share link has expired");
            return;
          }
          setShareInfo(data.share);
        }
      } catch {
        setError("Failed to load shared document");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchShareInfo();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-6 text-es-primary" />
          <p className="text-sm text-es-muted">Loading shared document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
        <div className="mx-4 max-w-sm rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center">
          <h1 className="mb-2 text-lg font-semibold text-red-800">
            Link Unavailable
          </h1>
          <p className="mb-6 text-sm text-red-600">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // User needs to sign in
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
      <div className="mx-4 max-w-sm rounded-2xl border border-[#e7e2d7] bg-white p-8 text-center shadow-[0_14px_26px_rgba(47,52,48,0.08)]">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#f3f2ed]">
            <svg
              className="size-6 text-es-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-es-ink">
            Sign in to view
          </h1>
          <p className="text-sm text-es-muted">
            This document is shared with you. Sign in to access it.
          </p>
        </div>

        <SignInButton
          afterSignInUrl={
            shareInfo?.documentId
              ? `/documents/${shareInfo.documentId}`
              : "/documents"
          }
          className="w-full"
        />
      </div>
    </div>
  );
}