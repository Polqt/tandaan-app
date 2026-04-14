import type { Metadata } from "next";
import LandingPage from "@/components/public/landing-page";

export const metadata: Metadata = {
  openGraph: {
    description: "A simple note-taking AI app.",
    images: ["/og-image.png"],
    title: "Tandaan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: "A simple note-taking AI app.",
    images: ["/og-image.png"],
    title: "Tandaan",
  },
};

export default function Home() {
  return <LandingPage />;
}
