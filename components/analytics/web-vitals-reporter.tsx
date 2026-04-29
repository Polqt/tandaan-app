"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { onCLS, onINP, onLCP } from "web-vitals";

export default function WebVitalsReporter() {
  useEffect(() => {
    const report = (metric: {
      id: string;
      name: string;
      rating: string;
      value: number;
    }) => {
      posthog.capture("web_vitals", {
        feature_flags: posthog.featureFlags.getFlags(),
        metric_id: metric.id,
        metric_name: metric.name,
        metric_rating: metric.rating,
        metric_value: metric.value,
      });

      fetch("/api/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch(() => {});
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
  }, []);

  return null;
}
