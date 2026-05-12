import type { Metadata } from "next";
import LandingPage from "@/components/marketing/landing/landing-page";

export const metadata: Metadata = {
  description:
    "Tandaan.AI is a collaborative workspace for real-time ideas, replayable sessions, and shared team knowledge.",
  openGraph: {
    description:
      "A collaborative workspace for real-time ideas, replayable sessions, and shared team knowledge.",
    images: ["/og-image.png"],
    title: "Tandaan.AI | Your ideas, remembered together",
    type: "website",
  },
  title: "Tandaan.AI | Your ideas, remembered together",
  twitter: {
    card: "summary_large_image",
    description:
      "A collaborative workspace for real-time ideas, replayable sessions, and shared team knowledge.",
    images: ["/og-image.png"],
    title: "Tandaan.AI | Your ideas, remembered together",
  },
};

export default function Home() {
  return <LandingPage />;
}
