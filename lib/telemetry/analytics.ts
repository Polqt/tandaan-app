"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

type IdentifyPayload = {
  createdAt?: string | null;
  email?: string | null;
  id: string;
  name?: string | null;
  plan?: string | null;
};

function isAnalyticsReady() {
  return (
    typeof window !== "undefined" &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_HOST)
  );
}

export function captureAnalyticsEvent(
  event: string,
  properties?: AnalyticsProperties,
) {
  if (!isAnalyticsReady()) {
    return;
  }

  posthog.capture(event, properties);
}

export function identifyAnalyticsUser({
  createdAt,
  email,
  id,
  name,
  plan,
}: IdentifyPayload) {
  if (!isAnalyticsReady()) {
    return;
  }

  posthog.identify(id, {
    created_at: createdAt ?? null,
    email: email ?? null,
    name: name ?? null,
    plan: plan ?? "free",
  });
}

export function resetAnalyticsIdentity() {
  if (!isAnalyticsReady()) {
    return;
  }

  posthog.reset();
}
