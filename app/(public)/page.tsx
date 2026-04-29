import type { Metadata } from "next";
import LandingPage from "@/components/marketing/landing/landing-page";

export const metadata: Metadata = {
  description:
    "Tandaan is a living workspace for notes, rooms, and replayable decisions.",
  openGraph: {
    description:
      "A living workspace for notes, rooms, and replayable decisions.",
    images: ["/og-image.png"],
    title: "Tandaan | Remember together",
    type: "website",
  },
  title: "Tandaan | Remember together",
  twitter: {
    card: "summary_large_image",
    description:
      "A living workspace for notes, rooms, and replayable decisions.",
    images: ["/og-image.png"],
    title: "Tandaan | Remember together",
  },
};

export default function Home() {
  return <LandingPage />;
}
