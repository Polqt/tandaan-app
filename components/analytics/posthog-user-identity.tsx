"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { usePlan } from "@/hooks/auth/use-plan";
import {
  identifyAnalyticsUser,
  resetAnalyticsIdentity,
} from "@/lib/telemetry/analytics";

export default function PostHogUserIdentity() {
  const { isLoaded, user } = useUser();
  const { plan } = usePlan();
  const lastIdentityRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      if (lastIdentityRef.current) {
        resetAnalyticsIdentity();
        lastIdentityRef.current = null;
      }
      return;
    }

    const nextIdentity = `${user.id}:${plan}`;
    if (lastIdentityRef.current === nextIdentity) {
      return;
    }

    identifyAnalyticsUser({
      createdAt: user.createdAt?.toISOString() ?? null,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      id: user.id,
      name: user.fullName ?? user.firstName ?? null,
      plan,
    });
    lastIdentityRef.current = nextIdentity;
  }, [isLoaded, plan, user]);

  return null;
}
