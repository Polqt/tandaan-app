"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AppPostHogProvider({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey || !posthogHost) return;

    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageleave: true,
      capture_pageview: true,
      person_profiles: "identified_only",
    });
  }, []);

  useEffect(() => {
    posthog.capture("$pageview", {
      $current_url:
        pathname + (searchParams.size ? `?${searchParams.toString()}` : ""),
      feature_flags: posthog.featureFlags.getFlags(),
    });
  }, [pathname, searchParams]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
